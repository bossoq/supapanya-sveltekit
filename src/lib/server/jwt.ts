import { SignJWT, jwtVerify } from 'jose'
import { JWT_SECRET } from '$app/env/private'

const secret = new TextEncoder().encode(JWT_SECRET)

export const signToken = async (payload: UserInfo) => {
  return new SignJWT({ ...payload }).setProtectedHeader({ alg: 'HS256', typ: 'JWT' }).sign(secret)
}

export const verifyToken = async (token: string) => {
  const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] })
  return payload as unknown as UserInfo
}
