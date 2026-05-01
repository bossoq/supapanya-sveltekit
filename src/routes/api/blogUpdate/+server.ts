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
  const { blog: payload } = data as { blog: BlogData }
  const prisma = new PrismaClient()
  const blog = await prisma.postTable.update({
    data: {
      postDate: payload.postDate,
      postTitle: payload.postTitle,
      postContent: payload.postContent,
      postExcerpt: payload.postExcerpt,
      postStatus: 'publish',
      postLink: payload.postLink,
      postPicture: payload.postPicture,
      postType: 'blog',
      postModified: new Date(),
      modifiedBy: user.id
    },
    where: {
      id: payload.id
    },
    select: {
      id: true,
      postDate: true,
      postTitle: true,
      postContent: true,
      postExcerpt: true,
      postLink: true,
      postPicture: true
    }
  })
  return json({
    success: true,
    message: 'Blog updated',
    blog: {
      id: Number(blog.id),
      postDate: blog.postDate,
      postTitle: blog.postTitle,
      postContent: blog.postContent,
      postExcerpt: blog.postExcerpt,
      postLink: blog.postLink,
      postPicture: blog.postPicture
    }
  })
}
