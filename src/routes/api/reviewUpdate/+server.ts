import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { PrismaClient } from '@prisma/client'

export const POST: RequestHandler = async ({ request }) => {
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
