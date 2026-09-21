import { z } from "astro/zod"; 

export const EpisodeSchema = z.object({
  id: z.string(),
  episode_number: z.number(),
  url: z.url(),
  thumbnail: z.url() ,
  duration: z.number().nullable().optional(),
});

  
 
export type IEpisode = z.infer<typeof EpisodeSchema>;



