import jwt from 'jwt-simple'
import { json } from '@sveltejs/kit'
import { PrismaClient } from '@prisma/client'
import { JWT_SECRET } from '$env/static/private'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ cookies, request }) => {
  const accessToken = cookies.get('accessToken')
  if (!accessToken || accessToken === null) {
    return json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  try {
    const decrypted = jwt.decode(accessToken, JWT_SECRET, false, 'HS256') as UserInfo
    if (!decrypted.meta.isAdmin) {
      return json({ success: false, message: 'Forbidden' }, { status: 403 })
    }
  } catch (e) {
    return json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  const data = await request.json()
  if (!data) {
    return json({ success: false, message: 'No data provided' }, { status: 400 })
  }
  const payload = data as CourseData
  const prisma = new PrismaClient()
  await prisma.postTable.updateMany({
    where: {
      postType: 'review',
      postStatus: 'publish'
    },
    data: {
      postStatus: 'archive'
    }
  })
  const review = await prisma.postTable.create({
    data: {
      authorId: payload.authorId,
      postTitle: 'Review',
      postContent: payload.postContent,
      postStatus: 'publish',
      postLink: 'review',
      postType: 'review'
    },
    select: {
      postContent: true
    }
  })
  return json({ success: true, message: 'Course updated', review })
}
