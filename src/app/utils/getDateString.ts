export function getDateString(date = new Date()): string {
  const [ dateStr ] = date.toISOString().split('T');

  return dateStr;
}
