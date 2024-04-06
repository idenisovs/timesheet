import { getMonday, getSunday } from '../utils';

export class Week {
  id: string = crypto.randomUUID();
  monday = new Date();
  sunday = new Date();

  constructor(date = new Date()) {
    this.monday = getMonday(date);
    this.sunday = getSunday(date);
  }
}
