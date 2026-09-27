export function formatEpisodeToNumber(episode: string | number): number {
  const parsed = Number(episode);
  return isNaN(parsed) ? 0 : parsed;
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
  const mins = typeof minutes === 'string' ? parseInt(minutes, 10) : minutes;
  const secs = typeof seconds === 'string' ? parseInt(seconds, 10) : seconds;

  const validMins = isNaN(mins) ? 0 : mins;
  const validSecs = isNaN(secs) ? 0 : secs;

  return validMins * 60 + validSecs;
}