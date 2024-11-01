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
  const { blog: payload, user } = data as { blog: BlogData; user: UserInfo }
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
