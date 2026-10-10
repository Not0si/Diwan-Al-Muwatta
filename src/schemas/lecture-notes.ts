// schemas/lecture-notes.ts
import { z } from "astro/zod"

const LectureNoteItemSchema = z.object({
  minute: z.number().int().nonnegative(),
  second: z.number().int().min(0).max(59),
  totalSeconds: z.number().int().nonnegative(),
  timeString: z.string(),
  detail: z.string(),
  episode: z.number().int().positive(),
})

export const LectureNotesSchema = z.array(LectureNoteItemSchema)

export type ILectureNote = z.infer<typeof LectureNoteItemSchema>

export const TimelinePrefixSchema = z.enum([
  "Book",
  "Chapter",
  "Hadith",
  "None",
])
export type TimelinePrefix = z.infer<typeof TimelinePrefixSchema>

export const TimelineItemSchema = z
  .object({
    book: z.string(),
    chapter: z.string(),
    prefix: TimelinePrefixSchema,
    endTime: z.number().nullish(),
    duration: z.number().nullish(),
  })
  .and(LectureNoteItemSchema)

export type ITimelineItem = z.infer<typeof TimelineItemSchema>
