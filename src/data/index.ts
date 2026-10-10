import { getCollection } from "astro:content"
import { parseMarkdownTable, processTimeline } from "./lecture-notes/_schema"
import type { IEpisode } from "./kursi_playlist/kursi_playlist"

export async function getEpisodesData() {
  const allEpisodes = await getCollection("lectureNotes")

  const parsedFiles = allEpisodes.map((entry) => ({
    id: entry.id,
    data: entry.data,
    tables: parseMarkdownTable(entry.body),
  }))

  const timeline = processTimeline(parsedFiles.flatMap((e) => e.tables))

  const allPlaylistEntries = await getCollection("playlist")

  const episodes: Record<number, IEpisode> = Object.fromEntries(
    allPlaylistEntries.map((item) => [item.data.episode_number, item.data])
  )

  return { episodes, timeline }
}
