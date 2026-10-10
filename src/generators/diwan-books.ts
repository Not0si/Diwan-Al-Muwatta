// lib/diwan-books.ts
import type { ITimelineItem } from "../schemas/lecture-notes"
import {
  DiwanBookSchema,
  type IDiwanBook,
  type IBookChapter,
} from "../schemas/diwan-books"

type ChapterAcc = {
  chapter_number: number
  title: string
  start_episode: number
  start_second: number
  end_episode: number | null
  hadith_count: number
}

type BookAcc = {
  book_number: number
  title: string
  start_episode: number
  start_second: number
  end_episode: number | null
  hadith_count: number
  chapters: Map<string, ChapterAcc>
  chapterOrder: string[]
}

function buildDiwanBooks(timeline: ITimelineItem[]): IDiwanBook[] {
  const books = new Map<string, BookAcc>()
  const bookOrder: string[] = []

  let bookCounter = 0
  let chapterCounter = 0

  for (const item of timeline) {
    // Skip rows that haven't landed in a book yet (before first "كتاب" row)
    if (!item.book) continue

    // --- Book ---
    let book = books.get(item.book)
    if (!book) {
      bookCounter++
      chapterCounter = 0 // reset chapter numbering for each new book
      book = {
        book_number: bookCounter,
        title: item.book,
        start_episode: item.episode,
        end_episode: item.episode,
        hadith_count: 0,
        chapters: new Map(),
        chapterOrder: [],
        start_second: item.totalSeconds,
      }
      books.set(item.book, book)
      bookOrder.push(item.book)
    } else {
      book.end_episode = item.episode
    }

    // Count only actual hadith rows (skip Book / Chapter header rows)
    const isHadithRow = item.prefix === "Hadith" || item.prefix === "None"
    if (isHadithRow) book.hadith_count++

    // --- Chapter ---
    if (!item.chapter) continue

    let chapter = book.chapters.get(item.chapter)
    if (!chapter) {
      chapterCounter++
      chapter = {
        chapter_number: chapterCounter,
        title: item.chapter,
        start_episode: item.episode,
        end_episode: item.episode,
        hadith_count: 0,
        start_second: item.totalSeconds,
      }
      book.chapters.set(item.chapter, chapter)
      book.chapterOrder.push(item.chapter)
    } else {
      chapter.end_episode = item.episode
    }

    if (isHadithRow) chapter.hadith_count++
  }

  return bookOrder.map((title) => {
    const b = books.get(title)!

    const chapters: IBookChapter[] = b.chapterOrder.map((cTitle) => {
      const c = b.chapters.get(cTitle)!
      return {
        chapter_number: c.chapter_number,
        title: c.title,
        start_episode: c.start_episode,
        start_second: c.start_second,
        end_episode: c.end_episode,
        hadith_count: c.hadith_count,
      }
    })

    return {
      book_number: b.book_number,
      title: b.title,
      start_episode: b.start_episode,
      start_second: b.start_second,
      end_episode: b.end_episode,
      hadith_count: b.hadith_count,
      chapters,
    }
  })
}

/**
 * Public helper: runs the builder + validates the result.
 */
export function getDiwanBooks(timeline: ITimelineItem[]): IDiwanBook[] {
  const built = buildDiwanBooks(timeline)
  const result = DiwanBookSchema.array().safeParse(built)
  if (!result.success) {
    console.error("Invalid diwan books derived from timeline:")
    console.error(result.error.format())
    throw new Error("Invalid diwan books data")
  }
  return result.data
}
