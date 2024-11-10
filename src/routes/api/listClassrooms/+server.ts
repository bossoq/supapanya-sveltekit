import jwt from 'jwt-simple'
import { json } from '@sveltejs/kit'
import { PrismaClient } from '@prisma/client'
import { JWT } from 'google-auth-library'
import { ConferenceRecordsServiceClient, SpacesServiceClient } from '@google-apps/meet'
import {
  JWT_SECRET,
  SERVICE_CLIENT_EMAIL,
  SERVICE_PRIVATE_KEY,
  SERVICE_SUBJECT
} from '$env/static/private'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ cookies }) => {
  const accessToken = cookies.get('accessToken')
  if (!accessToken || accessToken === null) {
    return json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  let user: UserInfo | undefined
  try {
    const decrypted = jwt.decode(accessToken, JWT_SECRET, false, 'HS256') as UserInfo
    user = decrypted
    if (!decrypted.meta.live) {
      return json({
        success: true,
        conferences: []
      })
    }
  } catch (e) {
    return json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  if (!user.id) {
    return json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  const prisma = new PrismaClient()
  const saclient = createJWT()
  const conferences = await listConferences(saclient)
  if (conferences.length === 0) {
    return json({
      success: true,
      conferences: []
    })
  }
  const participantsFilter = user.meta.isAdmin ? {} : { array_contains: user.id }
  const allowSpaces = await prisma.videoProcess.findMany({
    where: {
      spaceName: {
        in: conferences.map((conferences) => conferences.name)
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
  const allowConferences = conferences
    .filter((conference) => {
      if (user.meta.isAdmin) {
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
  return json({ success: true, conferences: allowConferences })
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
