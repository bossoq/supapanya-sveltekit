import { describe, it, expect } from 'vitest'
import { convertVideo, getPoster } from './utils'

describe('convertVideo', () => {
  describe('MP4', () => {
    const baseUrl = 'https://cdn.example.com/videos/myvideo'
    const result = convertVideo(baseUrl, 'MP4')

    it('returns an array', () => {
      expect(Array.isArray(result)).toBe(true)
    })

    it('returns one entry per resolution (4 total)', () => {
      expect((result as unknown[]).length).toBe(4)
    })

    it('builds correct src for each resolution', () => {
      const srcs = result as { src: string; type: string; width: number; height: number }[]
      expect(srcs[0].src).toBe('https://cdn.example.com/videos/myvideo/myvideo_1080p.mp4')
      expect(srcs[1].src).toBe('https://cdn.example.com/videos/myvideo/myvideo_720p.mp4')
      expect(srcs[2].src).toBe('https://cdn.example.com/videos/myvideo/myvideo_480p.mp4')
      expect(srcs[3].src).toBe('https://cdn.example.com/videos/myvideo/myvideo_360p.mp4')
    })

    it('sets type to video/mp4', () => {
      const srcs = result as { type: string }[]
      srcs.forEach((s) => expect(s.type).toBe('video/mp4'))
    })

    it('sets correct width and height for each resolution', () => {
      const srcs = result as { width: number; height: number }[]
      expect(srcs[0]).toMatchObject({ width: 1920, height: 1080 })
      expect(srcs[1]).toMatchObject({ width: 1280, height: 720 })
      expect(srcs[2]).toMatchObject({ width: 854, height: 480 })
      expect(srcs[3]).toMatchObject({ width: 640, height: 360 })
    })

    it('handles baseUrl with no path segments gracefully', () => {
      // When regex finds no match the baseFile falls back to empty string
      const result2 = convertVideo('', 'MP4') as { src: string }[]
      expect(result2[0].src).toBe('/_1080p.mp4')
    })
  })

  describe('HLS', () => {
    it('returns an object (not an array)', () => {
      const result = convertVideo('https://cdn.example.com/stream', 'HLS')
      expect(Array.isArray(result)).toBe(false)
    })

    it('builds the correct m3u8 URL', () => {
      const result = convertVideo('https://cdn.example.com/stream', 'HLS') as {
        src: string
        type: string
      }
      expect(result.src).toBe('https://cdn.example.com/stream/index.m3u8')
    })

    it('sets type to application/x-mpegurl', () => {
      const result = convertVideo('https://cdn.example.com/stream', 'HLS') as { type: string }
      expect(result.type).toBe('application/x-mpegurl')
    })
  })

  describe('invalid type', () => {
    it('throws for an unknown video type', () => {
      expect(() => convertVideo('https://cdn.example.com/v', 'DASH')).toThrow('Invalid video type')
    })

    it('throws for an empty string type', () => {
      expect(() => convertVideo('https://cdn.example.com/v', '')).toThrow('Invalid video type')
    })
  })
})

describe('getPoster', () => {
  it('appends /cover.jpg to the base URL', () => {
    expect(getPoster('https://cdn.example.com/videos/myvideo')).toBe(
      'https://cdn.example.com/videos/myvideo/cover.jpg'
    )
  })

  it('works with an empty base URL', () => {
    expect(getPoster('')).toBe('/cover.jpg')
  })
})
