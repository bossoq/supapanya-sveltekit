import jwt from 'jwt-simple'
import { redirect } from '@sveltejs/kit'
import { PrismaClient } from '@prisma/client'
import { JWT_SECRET } from '$env/static/private'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ cookies }) => {
  let user: UserInfo | undefined
  const accessToken = cookies.get('accessToken')
  if (!accessToken || accessToken === null) {
    return redirect(301, '/login')
  }
  try {
    user = jwt.decode(accessToken, JWT_SECRET, false, 'HS256') as UserInfo
  } catch (e) {
    return redirect(301, '/login')
  }
  if (!user) {
    return redirect(301, '/login')
  }
  let allowFilter: { [k: string]: unknown }
  if (user.meta.isAdmin) {
    allowFilter = {
      type: 'vod'
    }
  } else {
    allowFilter = {
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
    where: allowFilter
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
