import { glob } from "astro/loaders"
import { z } from "astro/zod"
import { defineCollection } from "astro:content"

// Articles: one markdown file per article in src/content/articles. The file name
// is the slug (`/artikel/<id>`); the body is the article. `featured: true` pins an
// article to the top of every list, ahead of newer ones.
const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    excerpt: z.string(),
    image: z.url(),
    featured: z.boolean().default(false),
  }),
})

export const collections = { articles }
