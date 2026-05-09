import { Injectable, signal } from '@angular/core';

import { Week } from '../../../entities';

@Injectable({
	providedIn: 'root',
})
export class WeekService {
	readonly focusedWeek = signal<Week>(new Week());
	readonly isMissingDaysVisible = signal<boolean>(false);

	setFocusedWeek(week: Week) {
		this.focusedWeek.set(week);
	}

	toggleMissingDaysVisibility() {
		this.isMissingDaysVisible.update(value => !value)
	}
}
