/**
 * Resolves media paths for docs.
 *
 * Set NEXT_PUBLIC_ASSETS_URL to an external origin (no trailing slash) to
 * serve media from there. Leave it unset to serve from public/ on this host,
 * in which case the Next basePath has to be added, because public/ is served
 * under it.
 */
const ASSETS_BASE = (process.env.NEXT_PUBLIC_ASSETS_URL ?? '').replace(/\/$/, '');
const BASE_PATH = '/worldbuilder';

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
  const encoded = encodeAssetPath(normalized);

  if (!ASSETS_BASE) return `${BASE_PATH}${encoded}`;

  return `${ASSETS_BASE}${encoded}`;
}
