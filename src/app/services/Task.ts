import { Activity } from '../dto';

export class Task {
  name: string;
  duration: string;
  activities: Activity[];

  constructor(name = '') {
    this.name = name;
    this.duration = '0m';
    this.activities = [];
  }
}
