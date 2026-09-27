import { defineCollection } from 'astro:content';
import { file, glob,   } from 'astro/loaders'; 
import {   EpisodeSchema  } from './data/playlist/playlist';
import {   EpisodeDetailsSchema } from './data/episodes/_schema';

 
const playlist = defineCollection({
  loader: file("src/data/playlist/playlist.json"),
  schema: EpisodeSchema,
});

const episodes = defineCollection({ 
  // Use glob loader for directories of markdown files
  loader: glob({ pattern: "**/*.md", base: "./src/data/episodes" }),
  schema: EpisodeDetailsSchema,
});

export const collections = { playlist, episodes };