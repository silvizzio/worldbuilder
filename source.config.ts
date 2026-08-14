import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { z } from 'zod';

const mediaSchema = z
  .object({
    type: z.enum(['video', 'gif']).default('video'),
    src: z.string(),
    poster: z.string().optional(),
    autoplay: z.boolean().default(true),
    muted: z.boolean().default(true),
    loop: z.boolean().default(true),
  })
  .optional();

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema.extend({
      summary: z.string().optional(),
      page: z.string().optional(),
      module: z.string().optional(),
      submodule: z.string().optional(),
      tags: z.array(z.string()).default([]),
      level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
      media: mediaSchema,
      screenshots: z.array(z.string()).optional(),
      details: z.boolean().default(true),
      cautions: z.array(z.string()).optional(),
    }),
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig();
