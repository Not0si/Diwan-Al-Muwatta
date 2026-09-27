import { z } from "astro/zod"

export const ChapterSchema = z.object({
  chapter_number: z.number(),
  title_arabic: z.string(),
  title_transliteration: z.string(),
  title_english: z.string(),
  page: z.number(),
})

export const MuwattaBookSchema = z.object({
  book_number: z.number(),
  title_arabic: z.string(),
  title_transliteration: z.string(),
  title_english: z.string(),
  start_page: z.number(),
  end_page: z.number(),
  hadith_count: z.number(),
  chapters: z.array(ChapterSchema),
})

export const MuwattaIndexSchema = z.object({
  work: z.object({
    title_arabic: z.string(),
    title_transliteration: z.string(),
    author: z.string(),
    recension_narrator: z.string(),
    edition_reference: z.string(),
    total_books: z.number(),
  }),
  books: z.array(MuwattaBookSchema),
})

export type Chapter = z.infer<typeof ChapterSchema>
export type MuwattaBook = z.infer<typeof MuwattaBookSchema>
export type MuwattaIndex = z.infer<typeof MuwattaIndexSchema>
