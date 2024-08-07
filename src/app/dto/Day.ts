import { Activity } from './Activity';
import { DayRecord } from '../store/entities';

export class Day {
  id: string = crypto.randomUUID();
  date: Date = new Date();
  weekId: string = '';
  activities: Activity[] = [];
  isMissing?: boolean;

  constructor(date?: Date) {
    if (date) {
      this.date = new Date(date);
    }

    this.date.setHours(0, 0, 0, 0);
  }

  static build(source: DayRecord): Day {
    const day = new Day();
    Object.assign(day, source)
    day.date = new Date(source.date);
    return day;
  }

  static entity(source: Day): DayRecord {
    const { id, date, weekId } = source;

    return {
      id,
      date,
      weekId
    };
  }
}
