// src/utils/getEpisodesData.ts
import { getCollection } from "astro:content"
import { parseMarkdownTable } from "../data/episodes/_schema"
import type { IEpisode } from "../data/playlist/playlist"
import {
  addQueryParams,
  formatEpisodeToNumber,
  timeToSeconds,
} from "../utils/globals"

export async function getEpisodesData() {
  const allEpisodes = await getCollection("episodes")

  const parsedFiles = allEpisodes.map((entry) => ({
    id: entry.id,
    data: entry.data,
    tables: parseMarkdownTable(entry.body),
  }))

  const allPlaylistEntries = await getCollection("playlist")

  const episodes: Record<number, IEpisode> = Object.fromEntries(
    allPlaylistEntries.map((item) => [item.data.episode_number, item.data])
  )

  return { parsedFiles, episodes }
}
