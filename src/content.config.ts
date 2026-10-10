import { defineCollection } from "astro:content"
import { file, glob } from "astro/loaders"
import { EpisodeSchema } from "./schemas/kursi-playlist"

const kursiPlaylist = defineCollection({
  loader: file("src/data/kursi_playlist/kursi_playlist.json"),
  schema: EpisodeSchema,
})

const lectureNotes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/lecture-notes" }),
})

export const collections = { kursiPlaylist, lectureNotes }
