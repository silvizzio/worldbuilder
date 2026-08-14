import { i18n } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { HtmlLang } from './html-lang';
import { Provider } from './provider';

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export default async function LangLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;
  const languages = i18n.languages as readonly string[];
  if (!languages.includes(lang)) notFound();

  return (
    <>
      <HtmlLang lang={lang} />
      <Provider lang={lang}>{children}</Provider>
    </>
  );
}
