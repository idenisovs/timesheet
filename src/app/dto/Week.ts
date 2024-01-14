import { Sheet } from './Sheet';
import { getDateString, getMonday, sortSheets } from '../utils';

export class Week {
  monday: Date;
  days: Sheet[] = [];

  constructor(date: Date|string = new Date()) {
    this.monday = getMonday(date);
  }

  fulfillMissingDays() {
    const currentDay = new Date(this.monday);

    for (let idx = 0; idx < 7; idx++) {
      const date = getDateString(currentDay);

      const existingDay = this.days.find((sheet) => {
        return sheet.date === date;
      });

      if (!existingDay) {
        this.days.push({
          date,
          activities: [],
          isMissing: true
        });
      }

      currentDay.setDate(currentDay.getDate() + 1);
    }

    this.days.sort(sortSheets);
  }
}
