import { calculateTotalDuration, endOfDay, getDateString, getMonday, getSunday, startOfDay } from '../utils';
import { Day } from './Day';
import { WeekRecord } from '../store/records';

export interface WeekSummary {
  duration: number;
  activities: number;
}

export class Week {
  id: string = crypto.randomUUID();
  from: Date;
  till: Date;
  days: Day[] = [];

  constructor(date = new Date()) {
    this.from = startOfDay(getMonday(date));
    this.till = endOfDay(getSunday(date));
  }

  getSummary(): WeekSummary {
    return this.days.reduce<WeekSummary>((result: WeekSummary, day: Day) => {
      result.duration += calculateTotalDuration(day.activities);
      result.activities += day.activities.length;
      return result;
    }, {
      activities: 0,
      duration: 0
    });
  }

  showMissingDays() {
    const schedule: Day[] = [];
    const currentDate = startOfDay(this.till);

    for (let idx = 0; idx < 7; idx++) {
      const expectedDay = this.findByDate(currentDate);

      if (expectedDay) {
        schedule.push(expectedDay);
      } else {
        const missingDay = new Day(currentDate);
        missingDay.weekId = this.id;
        missingDay.isMissing = true;
        schedule.push(missingDay);
      }

      currentDate.setDate(currentDate.getDate() - 1);
    }

    this.days = schedule;
  }

  hideMissingDays() {
    this.days = this.days.filter((day: Day) => !day.isMissing);
  }

  private findByDate(date: Date): Day | undefined {
    const targetDate = getDateString(date);
    return this.days.find((day: Day) => {
      const matchingDate = getDateString(day.date);
      return targetDate === matchingDate;
    });
  }

  static build(source: WeekRecord): Week {
    const week = new Week();

    week.id = source.id;
    week.from = new Date(source.from);
    week.till = new Date(source.till);
    week.days = [];

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
