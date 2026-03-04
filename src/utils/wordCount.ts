/**
 * Count words in a text string
 * Words are defined as sequences of characters separated by whitespace
 */
export function countWords(text: string | null | undefined): number {
  if (!text || typeof text !== 'string') {
    return 0;
  }

  // Trim whitespace and split by one or more whitespace characters
  const words = text.trim().split(/\s+/);

  // If the string is empty after trimming, return 0
  if (words.length === 1 && words[0] === '') {
    return 0;
  }

  return words.length;
}
