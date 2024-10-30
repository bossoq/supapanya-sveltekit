import { json } from '@sveltejs/kit'
import { resizeImage } from '$lib/utils'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request }) => {
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
