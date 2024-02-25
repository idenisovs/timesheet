import { Activity } from '../dto';

export class Issue {
  name: string;
  duration: string;
  activities: Activity[];

  constructor(name = '') {
    this.name = name;
    this.duration = '0m';
    this.activities = [];
  }
}
