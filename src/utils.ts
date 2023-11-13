/**
 * Returns the input string wrapped to the maximum line length.
 * @param str - The original input string.
 * @param maxLength - The maximum length of a single line.
 * @returns Array of word wrapped lines.
 */
export function wordWrap(str: string, maxLength: number): string[] {
  const regex = new RegExp('(\\S(.{0,' + maxLength + '}\\S)?)\\s+', 'g');
  return (str + ' ')
    .replace(regex, '$1\n')
    .trim()
    .split('\n')
    .map((line) => line.trim());
}

/**
 * Capitalizes the first letter of the input string.
 * @param str - The original input string.
 * @returns The capitalized string.
 */
export function capitalize(str: string): string {
  if (!str) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}
