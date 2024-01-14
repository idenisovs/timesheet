import { Sheet } from './Sheet';
import { getMonday } from '../utils';

export class Week {
  monday: Date;
  days: Sheet[] = [];

  constructor(date: Date|string = new Date()) {
    this.monday = getMonday(date);
  }
}
