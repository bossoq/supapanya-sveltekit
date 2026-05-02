import { json } from '@sveltejs/kit'
import { PrismaClient } from '@prisma/client'
import { JWT } from 'google-auth-library'
import { SpacesServiceClient } from '@google-apps/meet'
import {
  PUBSUB_TOPIC,
  SERVICE_CLIENT_EMAIL,
  SERVICE_PRIVATE_KEY,
  SERVICE_SUBJECT
} from '$env/static/private'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, locals }) => {
  const user = locals.user
  if (!user) {
    return json({ message: 'Unauthorized' }, { status: 401 })
  }
  if (!user.meta.isAdmin) {
    return json({ message: 'Forbidden' }, { status: 403 })
  }

  const { className, participants } = (await request.json()) as {
    className: string
    participants: number[]
  }

  if (!className || typeof className !== 'string') {
    return json({ message: 'Invalid class name' }, { status: 400 })
  }
  if (!Array.isArray(participants) || participants.length === 0) {
    return json({ message: 'Invalid participants' }, { status: 400 })
  }

  const prisma = new PrismaClient()
  const saclient = createJWT()
  const space = await createSpace(saclient)
  if (!space.name) {
    return json({ message: 'Failed to create space' }, { status: 500 })
  }
  const resp = await subscribeRecording(saclient, space.name)
  const subscribed = resp.status === 200
  try {
    await prisma.videoProcess.create({
      data: {
        spaceName: space.name,
        subscribed,
        participants,
        teacherId: user.id,
        className
      }
    })
  } catch (_e) {
    return json({ message: 'Failed to create space' }, { status: 500 })
  }
  return json({
    success: true,
    message: 'Space Created',
    meetingUri: space.meetingUri
  })
}

const createJWT = () => {
  return new JWT({
    email: SERVICE_CLIENT_EMAIL,
    key: SERVICE_PRIVATE_KEY,
    scopes: [
      'https://www.googleapis.com/auth/meetings.space.created',
      'https://www.googleapis.com/auth/meetings.space.readonly'
    ],
    subject: SERVICE_SUBJECT
  })
}

const createSpace = async (saclient: JWT) => {
  const client = new SpacesServiceClient({ authClient: saclient })
  const [space] = await client.createSpace({
    space: {
      config: {
        accessType: 2,
        entryPointAccess: 1
      }
    }
  })
  return space
}

const subscribeRecording = async (saclient: JWT, spaceName: string) => {
  const payload = {
    targetResource: `//meet.googleapis.com/${spaceName}`,
    eventTypes: ['google.workspace.meet.recording.v2.fileGenerated'],
    payloadOptions: { includeResource: false },
    notificationEndpoint: { pubsubTopic: PUBSUB_TOPIC }
  }
  return fetch('https://workspaceevents.googleapis.com/v1/subscriptions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${(await saclient.getAccessToken()).token}`
    },
    body: JSON.stringify(payload)
  })
}
