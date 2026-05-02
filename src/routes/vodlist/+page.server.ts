import { error, fail } from '@sveltejs/kit'
import { PrismaClient } from '@prisma/client'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) error(401, 'Unauthorized')
  if (!locals.user.meta.isAdmin) error(403, 'Forbidden')

  const prisma = new PrismaClient()
  const [videos, users] = await Promise.all([
    prisma.videoTable.findMany({
      where: { type: 'vod' },
      orderBy: { id: 'asc' },
      select: {
        id: true,
        name: true,
        baseUrl: true,
        fileType: true,
        allowAll: true,
        videoAccess: {
          select: {
            userId: true,
            user: { select: { displayName: true, userLogin: true } }
          }
        }
      }
    }),
    prisma.userTable.findMany({
      orderBy: { displayName: 'asc' },
      select: { id: true, displayName: true, userLogin: true }
    })
  ])

  return {
    videos: videos.map((v) => ({
      id: Number(v.id),
      name: v.name,
      baseUrl: v.baseUrl,
      fileType: v.fileType,
      allowAll: v.allowAll ?? true,
      videoAccess: v.videoAccess.map((a) => ({
        userId: Number(a.userId),
        displayName: a.user.displayName,
        userLogin: a.user.userLogin
      }))
    })),
    users: users.map((u) => ({
      id: Number(u.id),
      displayName: u.displayName,
      userLogin: u.userLogin
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
  },

  addAccess: async ({ locals, request }) => {
    if (!locals.user?.meta.isAdmin) return fail(403, { message: 'Forbidden' })

    const data = await request.formData()
    const videoId = Number(data.get('videoId'))
    const userId = Number(data.get('userId'))
    if (!videoId || !userId) return fail(400, { message: 'Missing fields' })

    const prisma = new PrismaClient()
    await prisma.videoAccess.upsert({
      where: { videoId_userId: { videoId: BigInt(videoId), userId: BigInt(userId) } },
      create: { videoId: BigInt(videoId), userId: BigInt(userId) },
      update: {}
    })
    return { success: true }
  },

  removeAccess: async ({ locals, request }) => {
    if (!locals.user?.meta.isAdmin) return fail(403, { message: 'Forbidden' })

    const data = await request.formData()
    const videoId = Number(data.get('videoId'))
    const userId = Number(data.get('userId'))
    if (!videoId || !userId) return fail(400, { message: 'Missing fields' })

    const prisma = new PrismaClient()
    await prisma.videoAccess.deleteMany({
      where: { videoId: BigInt(videoId), userId: BigInt(userId) }
    })
    return { success: true }
  }
} satisfies Actions
