import { i18n } from '@/lib/i18n';
import { notFound, redirect } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const languages = i18n.languages as readonly string[];
  if (!languages.includes(lang)) notFound();

  redirect(`/${lang}/docs/`);
}
