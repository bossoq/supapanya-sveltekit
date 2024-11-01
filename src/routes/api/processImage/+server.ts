import sharp from 'sharp'
import jwt from 'jwt-simple'
import { json } from '@sveltejs/kit'
import { JWT_SECRET } from '$env/static/private'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ cookies, request }) => {
  const accessToken = cookies.get('accessToken')
  if (!accessToken || accessToken === null) {
    return json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  try {
    const decrypted = jwt.decode(accessToken, JWT_SECRET, false, 'HS256') as UserInfo
    if (!decrypted.meta.isAdmin) {
      return json({ success: false, message: 'Forbidden' }, { status: 403 })
    }
  } catch (e) {
    return json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  const data = await request.formData()
  if (!data) {
    return json({ success: false, message: 'No data provided' }, { status: 400 })
  }
  const image = data.get('image')?.valueOf() as File | null
  const imageType = data.get('imageType')?.valueOf() as string | null
  if (!image || !imageType) {
    return json({ success: false, message: 'No image or image type provided' }, { status: 400 })
  }
  const imageBuffer = Buffer.from(await image.arrayBuffer())
  const resizedImage = await resizeImage(imageBuffer, imageType)
  if (!resizedImage) {
    return json({ success: false, message: 'Error resizing image' }, { status: 500 })
  }
  return json({ success: true, image: resizedImage })
}

const resizeImage = async (data: Buffer, imageType = 'full'): Promise<string> => {
  if (!data) {
    throw new Error('Invalid image')
  }
  const image = sharp(data)
  const metadata = await image.metadata()
  if (metadata.width && metadata.height) {
    const aspectRatio = metadata.width / metadata.height
    const newWidth = Math.min(metadata.width, imageType === 'full' ? 2048 : 640)
    const newHeight = Math.round(newWidth / aspectRatio)
    const resizedImage = await image.resize(newWidth, newHeight).webp().toBuffer()
    return `data:image/webp;base64,${resizedImage.toString('base64')}`
  } else {
    throw new Error('Invalid image')
  }
}
