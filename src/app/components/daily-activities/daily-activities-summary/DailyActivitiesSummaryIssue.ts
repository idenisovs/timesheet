import { Activity } from '../../../dto';

export class DailyActivitiesSummaryIssue {
  name: string;
  duration: string;
  activities: Activity[];

  constructor(name = '') {
    this.name = name;
    this.duration = '0m';
    this.activities = [];
  }
}
