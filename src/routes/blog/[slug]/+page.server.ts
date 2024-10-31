import { error } from '@sveltejs/kit'
import { PrismaClient } from '@prisma/client'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals, params }) => {
  if (!params.slug) {
    error(404, 'Not found')
  }
  if (!locals.user) {
    error(401, 'Unauthorized')
  }
  if (!locals.user.meta.isAdmin) {
    error(403, 'Forbidden')
  }
  const prisma = new PrismaClient()
  const blog = await prisma.postTable.findFirst({
    select: {
      user: {
        select: {
          displayName: true
        }
      },
      postDate: true,
      postTitle: true,
      postContent: true
    },
    where: {
      postType: 'blog',
      postStatus: 'publish',
      postLink: params.slug
    },
    orderBy: {
      id: 'desc'
    }
  })
  if (!blog) {
    error(404, 'Not found')
  }
  return {
    props: {
      blog: blog
    },
    user: locals.user
  }
}
