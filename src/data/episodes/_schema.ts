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
    .filter((cells) => cells.length >= 5)
    .map((cells) => ({
      minute: cells[1],
      second: cells[2],
      detail: cells[3],
      episode: cells[4],
    }))
    .filter((row) => row.minute || row.second || row.detail || row.episode)

  return result
}
