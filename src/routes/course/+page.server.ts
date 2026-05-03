import { prisma } from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  const course = await prisma.postTable.findFirst({
    select: {
      postContent: true
    },
    where: {
      postType: 'course',
      postStatus: 'publish'
    },
    orderBy: {
      id: 'desc'
    }
  })
  return {
    props: {
      course: course?.postContent
    },
    user: locals.user
  }
}
