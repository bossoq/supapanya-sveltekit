import { error } from '@sveltejs/kit'
import { PrismaClient } from '@prisma/client'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals, params }) => {
  if (!params.slug) {
    error(404, 'Not found')
  }
  const prisma = new PrismaClient()
  const blog = await prisma.postTable.findUnique({
    select: {
      id: true,
      postDate: true,
      postTitle: true,
      postContent: true,
      postExcerpt: true,
      postLink: true,
      postPicture: true
    },
    where: {
      id: Number(params.slug)
    }
  })
  if (!blog) {
    error(404, 'Not found')
  }
  return {
    props: {
      blog: {
        id: Number(blog.id),
        postDate: blog.postDate,
        postTitle: blog.postTitle,
        postContent: blog.postContent,
        postExcerpt: blog.postExcerpt,
        postLink: blog.postLink,
        postPicture: blog.postPicture
      }
    },
    user: locals.user
  }
}
