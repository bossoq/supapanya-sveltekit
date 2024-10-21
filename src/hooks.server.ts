import { redirect } from '@sveltejs/kit'
import type { Handle } from '@sveltejs/kit'

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
  if (event.cookies.get('user') !== undefined && event.cookies.get('user') !== null) {
    const accessToken = event.cookies.get('user')
    user = 'kittipos'
    role = 'admin'
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
    event.locals.user = { username: user, role }
    if (url.pathname === '/login') {
      return redirect(302, '/')
    }
  }
  return await resolve(event)
}
