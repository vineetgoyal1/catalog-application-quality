/**
 * Check if category is present and equals "businessApplication"
 */
export function hasApplicationSubTypeQuality(category: string | null | undefined): boolean {
  if (!category || category.trim().length === 0) {
    return false;
  }

  return category.trim() === 'businessApplication';
}
