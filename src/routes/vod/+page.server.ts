import { redirect } from '@sveltejs/kit'
import { PrismaClient } from '@prisma/client'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user
  if (!user) {
    return redirect(301, '/login')
  }
  const prisma = new PrismaClient()
  const videos = await prisma.videoTable.findMany({
    select: {
      id: true,
      name: true,
      baseUrl: true,
      fileType: true,
      allowList: true
    },
    orderBy: {
      id: 'asc'
    },
    where: {
      type: 'vod',
      OR: [
        {
          allowAll: true
        },
        {
          allowList: {
            array_contains: user.id
          }
        }
      ]
    }
  })
  return {
    user: user,
    props: {
      videos: videos.map((video) => {
        return {
          id: Number(video.id),
          title: video.name,
          url: video.baseUrl,
          fileType: video.fileType
        }
      })
    }
  }
}
