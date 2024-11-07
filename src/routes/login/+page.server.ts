import bcrypt from 'bcryptjs'
import jwt from 'jwt-simple'
import { fail, redirect } from '@sveltejs/kit'
import { PrismaClient } from '@prisma/client'
import type { Actions } from './$types'
import { JWT_SECRET } from '$env/static/private'

export const actions = {
  default: async ({ cookies, request }) => {
    if (request.method !== 'POST') {
      return fail(405, { message: 'Method not allowed' })
    }
    const data = await request.formData()
    const username = data.get('username')
    const password = data.get('password')

    if (!username) {
      return fail(400, { message: 'Username is required' })
    }
    if (!password) {
      return fail(400, { message: 'Password is required' })
    }

    const prisma = new PrismaClient()

    const user = await prisma.userTable.findFirst({
      where: {
        userLogin: username.toString().toLowerCase()
      }
    })
    if (!user) {
      return fail(401, { message: 'Incorrect username or password' })
    }
    if (user.authorised) {
      const match = await bcrypt.compare(password.toString(), user.userPassword)
      if (match) {
        const userData = {
          id: Number(user.id),
          userLogin: user.userLogin,
          displayName: user.displayName,
          meta: user.meta || {
            isAdmin: false,
            role: 'user',
            live: false
          }
        }
        const accessToken = jwt.encode(userData, JWT_SECRET, 'HS256')
        cookies.set('accessToken', accessToken, {
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: true,
          sameSite: 'lax',
          path: '/'
        })
        return redirect(302, '/')
      } else {
        return fail(401, { message: 'Incorrect username or password' })
      }
    } else {
      return fail(401, { message: 'Incorrect username or password' })
    }
  }
} satisfies Actions
