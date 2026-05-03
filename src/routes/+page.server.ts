import { prisma } from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  const posts = await prisma.postTable.findMany({
    select: {
      id: true,
      postTitle: true,
      postLink: true,
      postPicture: true
    },
    orderBy: {
      id: 'desc'
    },
    where: {
      postType: 'blog',
      postStatus: 'publish'
    },
    take: 3
  })
  return {
    props: {
      posts: posts.map((post) => {
        return {
          id: Number(post.id),
          title: post.postTitle,
          link: post.postLink,
          picture: post.postPicture
        }
      })
    }
  }
}
