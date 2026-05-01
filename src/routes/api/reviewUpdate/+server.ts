import { json } from '@sveltejs/kit'
import { PrismaClient } from '@prisma/client'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, locals }) => {
  const user = locals.user
  if (!user) {
    return json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  if (!user.meta.isAdmin) {
    return json({ success: false, message: 'Forbidden' }, { status: 403 })
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
      postStatus: 'archived'
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
  return json({ success: true, message: 'Review updated', review })
}
