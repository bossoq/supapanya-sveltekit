import { prisma } from '#lib/server/db.js'
import type { RequestHandler } from './$types'

export const DELETE: RequestHandler = async ({ request, locals }) => {
  const user = locals.user
  if (!user) {
    return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  if (!user.meta.isAdmin) {
    return Response.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  const data = await request.json()
  if (!data) {
    return Response.json({ success: false, message: 'No data provided' }, { status: 400 })
  }
  const { id } = data as { id: number }
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
  return Response.json({
    success: true,
    message: 'Blog deleted',
    blog
  })
}
