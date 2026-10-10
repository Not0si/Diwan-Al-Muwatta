import { defineCollection } from "astro:content"
import { file, glob } from "astro/loaders"
import { EpisodeSchema } from "./data/kursi_playlist/kursi_playlist"
import { EpisodeDetailsSchema } from "./data/lecture-notes/_schema"

const playlist = defineCollection({
  loader: file("src/data/kursi_playlist/kursi_playlist.json"),
  schema: EpisodeSchema,
})

const lectureNotes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/lecture-notes" }),
  schema: EpisodeDetailsSchema,
})

export const collections = { playlist, lectureNotes }
