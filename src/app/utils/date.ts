import { Sheet } from '../dto';

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

  const monday = new Date(currentDay);

  monday.setDate(currentDay.getDate() - (dayOfWeek - 1));

  return monday;
}

export function sortSheets(a: Sheet, b: Sheet): number {
  if (a.date < b.date) {
    return 1;
  } else if (a.date > b.date) {
    return -1;
  } else {
    return 0;
  }
}
