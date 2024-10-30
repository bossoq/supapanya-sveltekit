import { PrismaClient } from '@prisma/client'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  const prisma = new PrismaClient()
  const blogs = await prisma.postTable.findMany({
    select: {
      user: {
        select: {
          displayName: true
        }
      },
      postDate: true,
      postTitle: true,
      postExcerpt: true,
      postLink: true,
      postPicture: true
    },
    where: {
      postType: 'blog',
      postStatus: 'publish'
    },
    orderBy: {
      id: 'desc'
    }
  })
  return {
    props: {
      blogs: blogs
    },
    user: locals.user
  }
}
