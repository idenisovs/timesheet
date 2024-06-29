import { Activity } from '../../dto';

export class ActivityFormItem {
  id: string = crypto.randomUUID();
  name = '';
  from = '';
  till = '';
  duration = '';

  constructor(activity?: Activity) {
    if (activity) {
      this.id = activity.id;
      this.name = activity.name;
      this.from = activity.from;
      this.till = activity.till;
      this.duration = activity.duration;
    }
  }
}
