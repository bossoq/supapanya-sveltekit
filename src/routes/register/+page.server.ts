import bcrypt from 'bcryptjs'
import { error, fail, redirect } from '@sveltejs/kit'
import { prisma } from '$lib/server/db'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) error(401, 'Unauthorized')
  if (!locals.user.meta.isAdmin) error(403, 'Forbidden')
  return {}
}

export const actions = {
  default: async ({ locals, request }) => {
    if (!locals.user?.meta.isAdmin) {
      return fail(403, { message: 'Forbidden' })
    }

    const data = await request.formData()
    const username = data.get('username')?.toString().trim().toLowerCase()
    const displayName = data.get('displayName')?.toString().trim()
    const password = data.get('password')?.toString()
    const isAdmin = data.get('isAdmin') === 'on'

    if (!username) return fail(400, { message: 'Username is required' })
    if (!displayName) return fail(400, { message: 'Display name is required' })
    if (!password || password.length < 8) {
      return fail(400, { message: 'Password must be at least 8 characters' })
    }

    const existing = await prisma.userTable.findFirst({ where: { userLogin: username } })
    if (existing) return fail(409, { message: 'Username already taken' })

    const hashed = await bcrypt.hash(password, 10)
    await prisma.userTable.create({
      data: {
        userLogin: username,
        displayName,
        userPassword: hashed,
        authorised: true,
        meta: { isAdmin, role: isAdmin ? 'admin' : 'user', live: false }
      }
    })

    return redirect(302, '/register?success=1')
  }
} satisfies Actions
