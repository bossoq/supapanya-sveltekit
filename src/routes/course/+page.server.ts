import { PrismaClient } from '@prisma/client'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  const prisma = new PrismaClient()
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
