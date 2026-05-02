import { error, fail } from '@sveltejs/kit'
import { PrismaClient } from '@prisma/client'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) error(401, 'Unauthorized')
  if (!locals.user.meta.isAdmin) error(403, 'Forbidden')

  const prisma = new PrismaClient()
  const videos = await prisma.videoTable.findMany({
    where: { type: 'vod' },
    orderBy: { id: 'asc' },
    select: { id: true, name: true, baseUrl: true, fileType: true, allowAll: true }
  })
  return {
    videos: videos.map((v) => ({
      id: Number(v.id),
      name: v.name,
      baseUrl: v.baseUrl,
      fileType: v.fileType,
      allowAll: v.allowAll ?? true
    }))
  }
}

export const actions = {
  update: async ({ locals, request }) => {
    if (!locals.user?.meta.isAdmin) return fail(403, { message: 'Forbidden' })

    const data = await request.formData()
    const id = Number(data.get('id'))
    const name = data.get('name')?.toString().trim()
    const baseUrl = data.get('baseUrl')?.toString().trim()
    const fileType = data.get('fileType')?.toString().trim()
    const allowAll = data.get('allowAll') === 'on'

    if (!id || !name || !baseUrl || !fileType) {
      return fail(400, { message: 'All fields are required' })
    }

    const prisma = new PrismaClient()
    await prisma.videoTable.update({
      where: { id: BigInt(id) },
      data: { name, baseUrl, fileType, allowAll }
    })
    return { success: true }
  },

  delete: async ({ locals, request }) => {
    if (!locals.user?.meta.isAdmin) return fail(403, { message: 'Forbidden' })

    const data = await request.formData()
    const id = Number(data.get('id'))
    if (!id) return fail(400, { message: 'Missing id' })

    const prisma = new PrismaClient()
    await prisma.videoTable.delete({ where: { id: BigInt(id) } })
    return { success: true }
  }
} satisfies Actions
