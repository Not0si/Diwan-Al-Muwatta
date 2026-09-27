/**
 * Converts an episode identifier into a numeric value.
 *
 * Attempts to parse the provided value into a JavaScript number.
 * If parsing fails (e.g., the input is a non-numeric string or `NaN`),
 * it safely falls back to `0`.
 *
 * @param episode - The episode representation, either as a numeric value or a string.
 * @returns The parsed episode number, or `0` if the value cannot be converted to a valid number.
 *
 * @example
 * // Passing a string representation of a number:
 * formatEpisodeToNumber('12'); // Returns 12
 *
 * @example
 * // Passing a number directly:
 * formatEpisodeToNumber(5); // Returns 5
 *
 * @example
 * // Handling invalid or non-numeric strings:
 * formatEpisodeToNumber('special_episode'); // Returns 0
 */
export function formatEpisodeToNumber(episode: string | number): number {
  const parsed = Number(episode)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Converts minutes and seconds arguments into total seconds.
 * @param minutes - Number or string representation of minutes
 * @param seconds - Number or string representation of seconds
 */
export function timeToSeconds(
  minutes: string | number = 0,
  seconds: string | number = 0
): number {
  const mins = typeof minutes === "string" ? parseInt(minutes, 10) : minutes
  const secs = typeof seconds === "string" ? parseInt(seconds, 10) : seconds

  const validMins = isNaN(mins) ? 0 : mins
  const validSecs = isNaN(secs) ? 0 : secs

  return validMins * 60 + validSecs
}

/**
 * Appends or updates query parameters on a given URL.
 *
 * Uses the native `URL` API to handle query string syntax automatically,
 * inserting a `?` for the first parameter or `&` for subsequent parameters,
 * and overwriting any existing key matches.
 *
 * @param url - The absolute URL to modify (e.g., "https://example.com" or "https://example.com?page=1").
 * @param params - A key-value record of query parameters to add or update.
 * @returns The updated URL string with properly formatted and encoded query parameters.
 *
 * @example
 * // Adding parameters to a URL without existing query params:
 * addQueryParams('https://youtu.be/7LrHiUJ-wJg', { t: '1646' });
 * // Returns: "https://youtu.be/7LrHiUJ-wJg?t=1646"
 *
 * @example
 * // Appending parameters to a URL that already has query params:
 * addQueryParams('https://www.youtube.com/watch?v=7LrHiUJ-wJg', { t: '1646s' });
 * // Returns: "https://www.youtube.com/watch?v=7LrHiUJ-wJg&t=1646s"
 */
export function addQueryParams(
  url: string,
  params: Record<string | number, string | number>
): string {
  // Works with absolute URLs (e.g., https://example.com)
  const parsedUrl = new URL(url)

  Object.entries(params).forEach(([key, value]) => {
    parsedUrl.searchParams.set(key, value.toString())
  })

  return parsedUrl.toString()
}
