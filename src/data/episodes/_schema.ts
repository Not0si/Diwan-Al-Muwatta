import { z } from "astro/zod"

export const EpisodeDetailsSchema = z.object({
  title: z.string().optional(),
})

export type EpisodeDetails = z.infer<typeof EpisodeDetailsSchema>

export interface TableRow {
  minute: string
  second: string
  detail: string
  episode: string
}

export function parseMarkdownTable(markdownContent: string = ""): TableRow[] {
  const result = markdownContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|"))
    .slice(2)
    .map((line) => line.split("|").map((cell) => cell.trim()))
    .filter((cells) => cells.length >= 5 || !cells[3].length)
    .map((cells) => ({
      minute: cells[1],
      second: cells[2],
      detail: cells[3],
      episode: cells[4],
    }))
    .filter((row) => row.minute || row.second || row.detail || row.episode)

  return result
}

export interface TimelineItem extends TableRow {
  book: string
  chapter: string
  startTime: number // total seconds from episode start
  endTime: number | null // total seconds until next item with same prefix (or end of episode)
  duration: number | null // duration in seconds
}

// Helper to convert minute and second strings into total seconds
function toSeconds(minute: string, second: string): number {
  const m = parseInt(minute, 10) || 0
  const s = parseInt(second, 10) || 0
  return m * 60 + s
}

// Normalize prefix from English or Arabic
function parsePrefix(detail: string): string {
  const trimmed = detail.trim()

  // Matches optional 'ال' prefix for Arabic words, followed by the keyword
  const prefixRegex =
    /^(?:ال)?(كتاب|book|باب|chapter|حديث|hadith)(?:[\s|:\-ـ]|$)/iu
  const match = trimmed.match(prefixRegex)

  if (match) {
    const rawKey = match[1].toLowerCase()
    let prefix: string = "None"

    if (rawKey === "book" || rawKey === "كتاب") {
      prefix = "Book"
    } else if (rawKey === "chapter" || rawKey === "باب") {
      prefix = "Chapter"
    } else if (rawKey === "hadith" || rawKey === "حديث") {
      prefix = "Hadith"
    }

    const title = trimmed
      .slice(match[0].length)
      .replace(/^[\s|:\-ـ]+/, "")
      .trim()

    return prefix
  }

  return "None"
}

export function processTimeline(rows: TableRow[]): TimelineItem[] {
  let currentEpisode = ""
  let currentBook = ""
  let currentChapter = ""

  const items: TimelineItem[] = rows.map((row) => {
    const prefix = parsePrefix(row.detail)

    // Update active book or chapter when a row introduces a new one
    if (prefix === "Book") {
      currentBook = row.detail
      currentChapter = "" // Reset chapter when a new book starts
    } else if (prefix === "Chapter") {
      currentChapter = row.detail
    }

    return {
      ...row,
      book: currentBook,
      chapter: currentChapter,
      startTime: toSeconds(row.minute, row.second),
      endTime: null,
      duration: null,
    }
  })

  // Calculate durations within the same episode for matching prefixes
  for (let i = 0; i < items.length; i++) {
    const current = items[i]

    let nextItem: TimelineItem | null = null
    for (let j = i + 1; j < items.length; j++) {
      if (items[j].episode === current.episode) {
        nextItem = items[j]
        break
      }
    }

    if (nextItem) {
      current.endTime = nextItem.startTime
      current.duration = Math.max(0, current.endTime - current.startTime)
    }
  }

  return items
}
