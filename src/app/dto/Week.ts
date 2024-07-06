import { endOfDay, getMonday, getSunday, startOfDay } from '../utils';
import { Day } from './Day';
import { WeekEntity } from '../store/entities';

export class Week {
  id: string = crypto.randomUUID();
  from: Date;
  till: Date;
  days: Day[] = [];

  constructor(date = new Date()) {
    this.from = startOfDay(getMonday(date));
    this.till = endOfDay(getSunday(date));
  }

  static build(source: WeekEntity): Week {
    const week = new Week();

    week.id = source.id;
    week.from = new Date(source.from);
    week.till = new Date(source.till);
    week.days = [];

    return week;
  }

  static entity(source: Week): WeekEntity {
    const { id, from, till } = source;

    return {
      id,
      from: from.toISOString(),
      till: till.toISOString()
    };
  }
}
