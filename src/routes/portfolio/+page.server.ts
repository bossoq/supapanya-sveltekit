import { PrismaClient } from '@prisma/client'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  const prisma = new PrismaClient()
  const videos = await prisma.videoTable.findMany({
    select: {
      id: true,
      name: true,
      baseUrl: true,
      fileType: true
    },
    orderBy: {
      id: 'asc'
    },
    where: {
      type: 'portfolio',
      allowAll: true
    }
  })
  return {
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
