import { source } from '@/lib/source';
import type { TableOfContents } from 'fumadocs-core/toc';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import type { ComponentType } from 'react';

function normalizeSlug(slug?: string[]) {
  return slug?.filter(Boolean);
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const { lang, slug } = await params;
  const page = source.getPage(normalizeSlug(slug), lang);
  if (!page) notFound();

  const { body: Body, toc } = page.data as unknown as {
    body?: ComponentType;
    toc?: TableOfContents;
  };

  return (
    <DocsPage toc={toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      {page.data.description ? (
        <DocsDescription className="!mb-4 max-w-none leading-7">{page.data.description}</DocsDescription>
      ) : null}
      <DocsBody className="docs-content">
        {Body ? <Body /> : null}
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export function generateMetadata({ params }: { params: Promise<{ lang: string; slug?: string[] }> }) {
  return params.then(({ lang, slug }) => {
    const page = source.getPage(normalizeSlug(slug), lang);
    if (!page) notFound();

    return {
      title: page.data.title,
      description: page.data.description,
    };
  });
}
