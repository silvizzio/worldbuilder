/**
 * Resolves media paths for docs. Set NEXT_PUBLIC_ASSETS_URL to your S3 or CloudFront
 * origin (no trailing slash). Leave unset to serve from public/ on the same host.
 *
 * @example
 * NEXT_PUBLIC_ASSETS_URL=https://your-bucket.s3.ap-southeast-1.amazonaws.com
 * asset('/demos/project-center/foo.mp4')
 * // => https://your-bucket.s3.../demos/project-center/foo.mp4
 */
const ASSETS_BASE = (process.env.NEXT_PUBLIC_ASSETS_URL ?? '').replace(/\/$/, '');

function encodeAssetPath(path: string): string {
  return path
    .split('/')
    .map((segment, index) => {
      if (index === 0 && segment === '') return '';
      return encodeURIComponent(segment);
    })
    .join('/');
}

export function asset(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;

  const normalized = path.startsWith('/') ? path : `/${path}`;

  if (!ASSETS_BASE) return normalized;

  return `${ASSETS_BASE}${encodeAssetPath(normalized)}`;
}
