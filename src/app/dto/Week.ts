import { endOfDay, getMonday, getSunday, startOfDay } from '../utils';

export class Week {
  id: string = crypto.randomUUID();
  from = new Date();
  till = new Date();

  constructor(date = new Date()) {
    this.from = startOfDay(getMonday(date));
    this.till = endOfDay(getSunday(date));
  }
}
