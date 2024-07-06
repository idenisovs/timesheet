export class Activity {
  id: string;
  name: string;
  date: Date;
  from: string;
  till: string;
  duration: string;
  weekId: string;
  dayId: string;
  isImported?: boolean;

  constructor() {
    this.id = crypto.randomUUID();
    this.name = '';
    this.date = new Date();
    this.from = '';
    this.till = '';
    this.duration = '';
    this.weekId = '';
    this.dayId = '';
    this.isImported = false;
  }
}
