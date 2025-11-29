import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-activity-item-title',
	imports: [],
	templateUrl: './activity-item-title.component.html',
	styleUrl: './activity-item-title.component.scss',
})
export class ActivityItemTitleComponent {
	private static readonly DEFAULT_TICKET = 'Activity';

	@Input()
	activityName: string = '';

	get ActivityTicket(): string {
		const ticketSplitterIdx = this.activityName.indexOf(':');

		if (ticketSplitterIdx === -1) {
			return ActivityItemTitleComponent.DEFAULT_TICKET;
		}

		const ticket: string = this.activityName.slice(0, ticketSplitterIdx).trim();

		if (!ticket) {
			return ActivityItemTitleComponent.DEFAULT_TICKET;
		}

		return ticket;
	}
}
