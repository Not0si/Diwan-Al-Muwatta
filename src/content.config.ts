 
import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders'; 
import {   EpisodeSchema  } from './data/playlist/playlist';

 
const playlist = defineCollection({
  loader: file("src/data/playlist/playlist.json"),
  schema: EpisodeSchema,
});

export const collections = { playlist };