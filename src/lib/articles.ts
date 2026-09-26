import { getCollection, type CollectionEntry } from "astro:content"

export type Article = CollectionEntry<"articles">

/**
 * All articles: those marked `featured` first, then newest first. The first one is
 * the highlighted article on `/artikel` and leads the home rail.
 */
export async function getArticles(): Promise<Article[]> {
  const all = await getCollection("articles")
  return all.sort(
    (a, b) =>
      Number(b.data.featured) - Number(a.data.featured) ||
      b.data.date.valueOf() - a.data.date.valueOf(),
  )
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
