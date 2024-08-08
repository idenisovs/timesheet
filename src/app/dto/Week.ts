import { endOfDay, getMonday, getSunday, startOfDay } from '../utils';
import { WeekRecord } from '../store/records';

export class Week {
  id: string = crypto.randomUUID();
  from: Date;
  till: Date;

  constructor(date = new Date()) {
    this.from = startOfDay(getMonday(date));
    this.till = endOfDay(getSunday(date));
  }

  static build(source: WeekRecord): Week {
    const week = new Week();

    week.id = source.id;
    week.from = new Date(source.from);
    week.till = new Date(source.till);

    return week;
  }

  static entity(source: Week): WeekRecord {
    const { id, from, till } = source;

    return {
      id,
      from: from.toISOString(),
      till: till.toISOString()
    };
  }
}
