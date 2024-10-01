import parse from 'parse-duration';
import { duration } from 'yet-another-duration';

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

  return startOfDay(monday);
}

export function getSunday(currentDay: Date|string): Date {
  const monday = getMonday(currentDay);
  monday.setDate(monday.getDate() + 6);
  return monday;
}

export function startOfDay(date: Date): Date {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
}

export function endOfDay(date: Date): Date {
  const result = new Date(date);

  result.setHours(23, 59, 59, 999);

  return result;
}

export function startOfMonth(date: Date): Date {
  const result = new Date(date);

  result.setDate(1);

  return result;
}

export function endOfMonth(date = new Date()): Date {
  const year = date.getFullYear();
  const month = date.getMonth()+1;
  const day = 0;
  return new Date(year, month, day);
}

export function sumDuration(duration1: string, duration2: string): string {
  const d1 = parse(duration1);
  const d2 = parse(duration2);

  if (typeof d1 === 'undefined' || typeof d2 === 'undefined') {
    throw new Error('duration1 or duration2 is not defined!');
  }

  return duration(d1 + d2).toString();
}
