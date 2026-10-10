export const parseMarkdownTable = (table: string): string[][] => {
  const result = table
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|"))
    .slice(2)
    .map((line) => line.split("|").map((cell) => cell.trim()))

  return result
}
