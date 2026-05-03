import { prisma } from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  const review = await prisma.postTable.findFirst({
    select: {
      postContent: true
    },
    where: {
      postType: 'review',
      postStatus: 'publish'
    },
    orderBy: {
      id: 'desc'
    }
  })
  return {
    props: {
      review: review?.postContent
    },
    user: locals.user
  }
}
