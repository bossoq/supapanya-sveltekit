import jwt from 'jwt-simple'
import { json } from '@sveltejs/kit'
import { PrismaClient } from '@prisma/client'
import { JWT_SECRET } from '$env/static/private'
import type { RequestHandler } from './$types'

export const DELETE: RequestHandler = async ({ cookies, request }) => {
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
  const { id, user } = data as { id: number; user: UserInfo }
  const prisma = new PrismaClient()
  const blog = await prisma.postTable.update({
    data: {
      postStatus: 'archived',
      postModified: new Date(),
      modifiedBy: user.id
    },
    where: {
      id
    },
    select: {
      postTitle: true
    }
  })
  return json({
    success: true,
    message: 'Blog deleted',
    blog
  })
}
