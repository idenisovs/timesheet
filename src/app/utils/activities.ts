import parseDuration from 'parse-duration';
import { Activity } from '../dto';

export function calculateTotalDuration(activities: Activity[]): number {
  return activities.reduce<number>((result: number, activity: Activity) => {
    const activityDuration = parseDuration(activity.duration);

    if (activityDuration) {
      return result + activityDuration;
    }

    return result;
  }, 0);
}
