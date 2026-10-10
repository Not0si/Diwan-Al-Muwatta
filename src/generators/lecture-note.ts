import { getCollection } from "astro:content"
import { parseMarkdownTable } from "../utils/markdown"
import { LectureNotesSchema } from "../schemas/lecture-notes"

export async function getLectureNotes() {
  const rawLectureNotes = await getCollection("lectureNotes")

  const lectures = rawLectureNotes
    .flatMap((entry) => {
      return parseMarkdownTable(entry.body ?? "").map((cells) => {
        const minute = Number(cells[1]) || 0
        const second = Number(cells[2]) || 0
        return {
          minute,
          second,
          totalSeconds: minute * 60 + second,
          timeString: `${minute}:${second}`,
          detail: cells[3] ?? "",
          episode: Number(cells[4]) || 0,
        }
      })
    })
    .filter((e) => e.detail.length)

  const result = LectureNotesSchema.safeParse(lectures)

  if (!result.success) {
    console.error("Failed to validate lecture notes:", result.error.format())
    throw new Error("Invalid lecture notes data format")
  }

  return result.data
}
