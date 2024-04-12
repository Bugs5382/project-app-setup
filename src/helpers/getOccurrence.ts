/**
 * Count Occurrences
 * @since 1.2.1
 * @param array
 * @param value
 */
export const getOccurrence = (array: any, value: any): number => {
  return array.filter((v: any) => (v.includes(value) === true)).length
}
