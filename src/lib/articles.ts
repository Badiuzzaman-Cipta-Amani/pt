import { getCollection, type CollectionEntry } from "astro:content"

export type Article = CollectionEntry<"articles">

/** All articles, newest first. The first one is the featured article. */
export async function getArticles(): Promise<Article[]> {
  const all = await getCollection("articles")
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

// Dates are stored as calendar days; format in UTC so the day never shifts.
const dateFormat = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

export const formatDate = (date: Date) => dateFormat.format(date)

/** Rewrite the `w=` of an Unsplash URL so cards fetch a smaller rendition. */
export const imageAt = (url: string, width: number) => url.replace(/w=\d+/, `w=${width}`)
