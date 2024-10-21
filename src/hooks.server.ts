import { redirect } from '@sveltejs/kit'
import jwt from 'jwt-simple'
import type { Handle } from '@sveltejs/kit'
import { JWT_SECRET } from '$env/static/private'

const publicPaths = [
  '/',
  '/login',
  '/logout',
  '/contact',
  '/course',
  '/portfolio',
  '/review',
  '/studytips'
]
const adminPaths = ['/register', '/vodedit', '/vodlist']

const isPathAllowed = (path: string) => {
  return publicPaths.includes(path) || publicPaths.some((publicPath) => path.startsWith(publicPath))
}

export const handle: Handle = async ({ event, resolve }) => {
  let user: string | null = null
  let role: string | null = null
  let decrypted: UserInfo | null = null
  if (event.cookies.get('accessToken') !== undefined && event.cookies.get('accessToken') !== null) {
    const accessToken = event.cookies.get('accessToken')
    if (accessToken) {
      try {
        decrypted = jwt.decode(accessToken, JWT_SECRET, false, 'HS256') as UserInfo
        user = decrypted.userLogin
        role = decrypted.meta.role
      } catch (e) {
        event.cookies.set('accessToken', '', {
          httpOnly: true,
          sameSite: 'lax',
          maxAge: 0,
          path: '/'
        })
        redirect(302, '/')
      }
    }
  }
  const url = new URL(event.request.url)

  if (!user && !isPathAllowed(url.pathname)) {
    return redirect(302, '/login')
  }
  if (
    role === 'user' &&
    (adminPaths.includes(url.pathname) ||
      adminPaths.some((adminPath) => url.pathname.startsWith(adminPath)))
  ) {
    return redirect(302, '/')
  }
  if (user && role) {
    event.locals.user = decrypted
    if (url.pathname === '/login') {
      return redirect(302, '/')
    }
  }
  return await resolve(event)
}
