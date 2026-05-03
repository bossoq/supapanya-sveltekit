import { prisma } from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
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
      type: 'studytips',
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
