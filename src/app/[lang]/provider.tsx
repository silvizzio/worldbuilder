'use client';

import { translations } from '@/lib/layout.shared';
import { i18nProvider } from 'fumadocs-ui/i18n';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { ReactNode } from 'react';
import SearchDialog from '@/components/search';

export function Provider({ lang, children }: { lang: string; children: ReactNode }) {
  return (
    <RootProvider
      i18n={i18nProvider(translations, lang)}
      theme={{ enabled: false }}
      search={{ SearchDialog }}
    >
      {children}
    </RootProvider>
  );
}
