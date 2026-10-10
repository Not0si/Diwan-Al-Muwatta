// schemas/diwan-books.ts
import { z } from "astro/zod"

export const ChapterSchema = z.object({
  chapter_number: z.number(),
  title: z.string(),
  start_episode: z.number().nullable(),
  end_episode: z.number().nullable(),
  hadith_count: z.number(),
})

export const DiwanBookSchema = z.object({
  book_number: z.number(),
  title: z.string(),
  start_episode: z.number().nullable(),
  end_episode: z.number().nullable(),
  hadith_count: z.number(),
  chapters: z.array(ChapterSchema),
})

export type IBookChapter = z.infer<typeof ChapterSchema>
export type IDiwanBook = z.infer<typeof DiwanBookSchema>
