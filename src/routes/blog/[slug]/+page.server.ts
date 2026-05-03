import { error } from '@sveltejs/kit'
import { prisma } from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals, params }) => {
  if (!params.slug) {
    error(404, 'Not found')
  }
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
