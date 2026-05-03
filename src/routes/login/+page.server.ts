import bcrypt from 'bcryptjs'
import jwt from 'jwt-simple'
import { fail, redirect } from '@sveltejs/kit'
import { prisma } from '$lib/server/db'
import type { Actions } from './$types'
import { JWT_SECRET } from '$env/static/private'

// In-memory rate limiter: max 5 attempts per IP per 15 minutes
const attempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now()
  const entry = attempts.get(ip)
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (entry.count >= MAX_ATTEMPTS) return false
  entry.count++
  return true
}

const clearAttempts = (ip: string) => attempts.delete(ip)

export const actions = {
  default: async ({ cookies, request, getClientAddress }) => {
    const ip = getClientAddress()
    if (!checkRateLimit(ip)) {
      return fail(429, { message: 'Too many login attempts. Please try again later.' })
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
        clearAttempts(ip)
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
