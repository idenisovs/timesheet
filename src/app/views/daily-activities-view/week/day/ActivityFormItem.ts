import { Activity } from '@entities';
import { getId } from '@utils/get-id';

export class ActivityFormItem {
	id: string = getId();
	name = '';
	from = '';
	till = '';
	duration = '';
	color: string | null = null;

	constructor(activity?: Activity) {
		if (!activity) {
			return;
		}

		this.id = activity.id;
		this.name = activity.name;
		this.from = activity.from;
		this.till = activity.till;
		this.duration = activity.duration;
		this.color = activity.color ?? null;
	}
}
