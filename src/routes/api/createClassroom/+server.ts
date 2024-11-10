import jwt from 'jwt-simple'
import { json } from '@sveltejs/kit'
import { PrismaClient } from '@prisma/client'
import { JWT } from 'google-auth-library'
import { SpacesServiceClient } from '@google-apps/meet'
import {
  JWT_SECRET,
  PUBSUB_TOPIC,
  SERVICE_CLIENT_EMAIL,
  SERVICE_PRIVATE_KEY,
  SERVICE_SUBJECT
} from '$env/static/private'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ cookies, request }) => {
  if (request.method !== 'POST') {
    return json({ message: 'Method not allowed' }, { status: 405 })
  }
  let user: UserInfo | undefined
  const accessToken = cookies.get('accessToken')
  if (!accessToken || accessToken === null) {
    return json({ message: 'Unauthorized' }, { status: 401 })
  }
  try {
    user = jwt.decode(accessToken, JWT_SECRET, false, 'HS256') as UserInfo
  } catch (e) {
    return json({ message: 'Unauthorized' }, { status: 401 })
  }
  if (!user) {
    return json({ message: 'Unauthorized' }, { status: 401 })
  }
  if (!user.meta.isAdmin) {
    return json({ message: 'Unauthorized' }, { status: 401 })
  }
  const { className, participants } = (await request.json()) as {
    className: string
    participants: number[]
  }

  if (!className || typeof className !== 'string') {
    return json({ message: 'Invalid class name' }, { status: 400 })
  }
  if (!participants) {
    return json({ message: 'Invalid participants' }, { status: 400 })
  }
  if (!Array.isArray(participants)) {
    return json({ message: 'Invalid participants' }, { status: 400 })
  }
  if (participants.length === 0) {
    return json({ message: 'Invalid participants' }, { status: 400 })
  }

  const prisma = new PrismaClient()
  const saclient = createJWT()
  const space = await createSpace(saclient)
  if (!space.name) {
    return json({ message: 'Failed to create space' }, { status: 500 })
  }
  const resp = await subscribeRecording(saclient, space.name)
  let subscribed = false
  if (resp.status === 200) {
    subscribed = true
  }
  try {
    await prisma.videoProcess.create({
      data: {
        spaceName: space.name,
        subscribed: subscribed,
        participants: participants,
        teacherId: user.id,
        className: className
      }
    })
  } catch (e) {
    return json({ message: 'Failed to create space' }, { status: 500 })
  }
  return json({
    success: true,
    message: 'Space Created',
    meetingUri: space.meetingUri
  })
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

const createSpace = async (saclient: JWT) => {
  const client = new SpacesServiceClient({
    authClient: saclient
  })
  const request = {
    space: {
      config: {
        accessType: 2,
        entryPointAccess: 1
      }
    }
  }
  const [space] = await client.createSpace(request)
  return space
}

const subscribeRecording = async (saclient: JWT, spaceName: string) => {
  const payload = {
    targetResource: `//meet.googleapis.com/${spaceName}`,
    eventTypes: ['google.workspace.meet.recording.v2.fileGenerated'],
    payloadOptions: {
      includeResource: false
    },
    notificationEndpoint: {
      pubsubTopic: PUBSUB_TOPIC
    }
  }
  const resp = await fetch('https://workspaceevents.googleapis.com/v1/subscriptions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${(await saclient.getAccessToken()).token}`
    },
    body: JSON.stringify(payload)
  })
  return resp
}
