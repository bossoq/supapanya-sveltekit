import { describe, it, expect } from 'vitest';
import { convertVideo, getPoster } from './utils';

describe('utils', () => {
	it('should return HLS source when videoType is HLS', () => {
		const baseUrl = 'https://example.com/video';
		const result = convertVideo(baseUrl, 'HLS');
		expect(result).toEqual({
			src: 'https://example.com/video/index.m3u8',
			type: 'application/x-mpegurl'
		});
	});

	it('should return MP4 sources when videoType is MP4', () => {
		const baseUrl = 'https://example.com/video/myvideo';
		const result = convertVideo(baseUrl, 'MP4');
		expect(Array.isArray(result)).toBe(true);
		if (Array.isArray(result)) {
			expect(result.length).toBe(4);
			expect(result[0].src).toBe('https://example.com/video/myvideo/myvideo_1080p.mp4');
		}
	});

	it('should throw error for invalid video type', () => {
		expect(() => convertVideo('url', 'INVALID')).toThrow('Invalid video type');
	});

	it('should return correct poster URL', () => {
		const baseUrl = 'https://example.com/video';
		expect(getPoster(baseUrl)).toBe('https://example.com/video/cover.jpg');
	});
});
