import jwt from 'jwt-simple'
import { redirect } from '@sveltejs/kit'
import { PrismaClient } from '@prisma/client'
import { JWT } from 'google-auth-library'
import { ConferenceRecordsServiceClient, SpacesServiceClient } from '@google-apps/meet'
import {
  JWT_SECRET,
  SERVICE_CLIENT_EMAIL,
  SERVICE_PRIVATE_KEY,
  SERVICE_SUBJECT
} from '$env/static/private'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals, cookies }) => {
  const accessToken = cookies.get('accessToken')
  if (!accessToken || accessToken === null) {
    return redirect(301, '/login')
  }
  if (!locals.user) {
    return redirect(301, '/login')
  }
  let userId: number | undefined
  let isAdmin = false
  let students: User[] = []
  let conferences: Conference[] = []
  try {
    const decrypted = jwt.decode(accessToken, JWT_SECRET, false, 'HS256') as UserInfo
    userId = decrypted.id
    isAdmin = decrypted.meta.isAdmin
    if (!decrypted.meta.live) {
      return {
        user: locals.user,
        conferences: [],
        students
      }
    }
  } catch (e) {
    return redirect(301, '/login')
  }
  if (!userId) {
    return redirect(301, '/login')
  }
  const prisma = new PrismaClient()
  if (isAdmin) {
    const retStudents = await prisma.userTable.findMany({
      where: {
        authorised: true,
        meta: {
          path: ['isAdmin'],
          equals: false
        }
      },
      select: {
        id: true,
        displayName: true
      }
    })
    students = retStudents.map((student) => {
      return {
        id: Number(student.id),
        displayName: student.displayName
      }
    })
  }
  const saclient = createJWT()
  const retConferences = await listConferences(saclient)
  if (retConferences.length === 0) {
    return {
      user: locals.user,
      conferences,
      students
    }
  }
  const participantsFilter = isAdmin ? {} : { array_contains: userId }
  const allowSpaces = await prisma.videoProcess.findMany({
    where: {
      spaceName: {
        in: retConferences.map((conference) => conference.name)
      },
      participants: participantsFilter
    },
    select: {
      spaceName: true,
      className: true,
      teacher: {
        select: {
          displayName: true
        }
      }
    }
  })
  conferences = retConferences
    .filter((conference) => {
      if (isAdmin) {
        return true
      }
      return allowSpaces.some((space) => space.spaceName === conference.name)
    })
    .map((conference) => {
      const space = allowSpaces.find((space) => space.spaceName === conference.name)
      return {
        ...conference,
        className: space?.className,
        teacher: space?.teacher.displayName
      }
    })
  return { user: locals.user, conferences, students }
}

const createJWT = () => {
  const saclient = new JWT({
    email: SERVICE_CLIENT_EMAIL,
    key: SERVICE_PRIVATE_KEY,
    scopes: [
      'https://www.googleapis.com/auth/meetings.space.created',
      'https://www.googleapis.com/auth/meetings.space.readonly'
    ],
    subject: SERVICE_SUBJECT
  })
  return saclient
}

const listConferences = async (saclient: JWT) => {
  const meetClient = new ConferenceRecordsServiceClient({
    authClient: saclient
  })
  const spaceClient = new SpacesServiceClient({
    authClient: saclient
  })
  const [conferences] = await meetClient.listConferenceRecords({
    filter: 'end_time IS NULL'
  })
  const conferenceList = []
  for (const conference of conferences) {
    if (!conference.space) {
      continue
    }
    const [space] = await spaceClient.getSpace({
      name: conference.space
    })
    if (!space.name || !space.meetingUri) {
      continue
    }
    conferenceList.push({
      name: space.name,
      meetingUri: space.meetingUri,
      meetingCode: space.meetingCode,
      startTime: String(conference.startTime?.seconds || new Date().getTime())
    })
  }
  return conferenceList
}
