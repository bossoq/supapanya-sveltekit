export type HLSSrc = { src: string; type: 'application/x-mpegurl' }
export type VideoSrc = { src: string; type: 'video/mp4'; width: number; height: number }

const resolutions = [
  {
    name: '1080p',
    width: 1920,
    height: 1080
  },
  {
    name: '720p',
    width: 1280,
    height: 720
  },
  {
    name: '480p',
    width: 854,
    height: 480
  },
  {
    name: '360p',
    width: 640,
    height: 360
  }
]

export const convertVideo = (baseUrl: string, videoType: string): HLSSrc | VideoSrc[] => {
  if (videoType === 'MP4') {
    const match = baseUrl.match(/([^/]+$)/)
    let baseFile: string
    if (match) {
      baseFile = match[1]
    } else {
      baseFile = ''
    }
    const src: VideoSrc[] = []
    resolutions.forEach((resolution) => {
      src.push({
        src: `${baseUrl}/${baseFile}_${resolution.name}.mp4`,
        type: 'video/mp4',
        width: resolution.width,
        height: resolution.height
      })
    })
    return src
  } else if (videoType === 'HLS') {
    return {
      src: `${baseUrl}/index.m3u8`,
      type: 'application/x-mpegurl'
    }
  } else {
    throw new Error('Invalid video type')
  }
}

export const getPoster = (baseUrl: string): string => {
  return `${baseUrl}/cover.jpg`
}

// Pick the smallest MP4 that still covers the player's width in device pixels; fall back to the
// largest. Video.js 10 has no quality menu for progressive MP4s, so this replaces vidstack's menu.
export const pickVideoSrc = (
  sources: VideoSrc[],
  cssWidth: number,
  pixelRatio: number
): VideoSrc => {
  const target = cssWidth * pixelRatio
  const bySize = [...sources].sort((a, b) => a.width - b.width)
  return bySize.find((source) => source.width >= target) ?? bySize[bySize.length - 1]
}
