import {
  type ILectureNote,
  type ITimelineItem,
  type TimelinePrefix,
} from "../schemas/lecture-notes"
import { getLectureNotes } from "./lecture-note"

function parsePrefix(detail: string): TimelinePrefix {
  const trimmed = detail.trim()

  const prefixRegex =
    /^(?:ال)?(كتاب|book|باب|chapter|حديث|hadith)(?:[\s|:\-ـ]|$)/iu
  const match = trimmed.match(prefixRegex)

  if (match) {
    const rawKey = match[1].toLowerCase()
    if (rawKey === "book" || rawKey === "كتاب") return "Book"
    if (rawKey === "chapter" || rawKey === "باب") return "Chapter"
    if (rawKey === "hadith" || rawKey === "حديث") return "Hadith"
  }

  return "None"
}

function processTimeline(rows: ILectureNote[]): ITimelineItem[] {
  let currentBook = ""
  let currentChapter = ""
  let currentHadith = ""

  const items: ITimelineItem[] = rows.map((row) => {
    const prefix = parsePrefix(row.detail)

    if (prefix === "Book") {
      currentBook = row.detail
      currentChapter = ""
    } else if (prefix === "Chapter") {
      currentChapter = row.detail
    } else if (prefix === "Hadith") {
      currentHadith = row.detail
    }

    return {
      ...row,
      book: currentBook,
      chapter: currentChapter,
      hadith: currentHadith,
      prefix,
      totalSeconds: row.totalSeconds,
      endTime: null,
      duration: null,
    }
  })

  for (let i = 0; i < items.length; i++) {
    const current = items[i]
    for (let j = i + 1; j < items.length; j++) {
      if (items[j].episode === current.episode) {
        current.endTime = items[j].totalSeconds
        current.duration = Math.max(0, current.endTime - current.totalSeconds)
        break
      }
    }
  }

  return items
}

export async function getTimeline() {
  const lectures = await getLectureNotes()

  const timeline = processTimeline(lectures)

  return timeline
}
