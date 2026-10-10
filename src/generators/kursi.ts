import { getCollection } from "astro:content"

export async function getKursiData() {
  const rawKursi = await getCollection("kursiPlaylist")

  // Build both the array and lookup object in a single pass using reduce
  const { kursiArray, kursiObject } = rawKursi.reduce(
    (acc, entry) => {
      const data = entry.data

      acc.kursiArray.push(data)
      acc.kursiObject[Number(data.episode_number)] = data

      return acc
    },
    {
      kursiArray: [] as (typeof rawKursi)[number]["data"][],
      kursiObject: {} as Record<number, (typeof rawKursi)[number]["data"]>,
    }
  )

  kursiArray.sort((a, b) => Number(a.id) - Number(b.id))

  return { kursiArray, kursiObject }
}
