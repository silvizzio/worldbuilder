import { i18n } from '@/lib/i18n';
import { docs } from 'collections/server';
import { loader } from 'fumadocs-core/source';

export const source = loader(docs.toFumadocsSource(), {
  baseUrl: '/docs',
  i18n,
  url(slugs, locale) {
    if (locale) return '/' + [locale, 'docs', ...slugs].join('/');
    return '/' + ['docs', ...slugs].join('/');
  },
});
