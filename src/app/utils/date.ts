export function getDateString(date = new Date()): string {
  const [ dateStr ] = date.toISOString().split('T');

  return dateStr;
}

export function getMonday(date: Date|string): Date {
  let currentDay;

  if (typeof date === 'string') {
    currentDay = new Date(date);
  } else {
    currentDay = date;
  }

  const dayOfWeek = currentDay.getDay() === 0 ? 7 : currentDay.getDay();

  const monday = new Date();

  monday.setDate(currentDay.getDate() - (dayOfWeek - 1));

  return monday;
}
