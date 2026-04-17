import { Component, inject, input } from '@angular/core';

import { Activity } from '../../../entities';
import { ImportedActivityDiffComponent } from './imported-activity-diff/imported-activity-diff.component';
import { ImportActivitiesService } from './import-activities.service';
import { ActivitiesRepositoryService } from '../../../repository/activities-repository.service';

@Component({
	selector: 'app-import-activities',
	imports: [
		ImportedActivityDiffComponent,
	],
	templateUrl: './import-activities.component.html',
	styleUrl: './import-activities.component.scss',
})
export class ImportActivitiesComponent {
	private importService = inject(ImportActivitiesService);
	private activityRepository = inject(ActivitiesRepositoryService);

	importedActivities = input.required<Activity[]>();

	async saveAll() {
		let savedActivitiesCount = 0;

		for (let idx = 0; idx < this.importedActivities().length; idx++) {
			const activity = this.importedActivities()[idx];
			await this.importService.save(activity);
			this.removeCompletedActivity(activity);
			idx--;
			savedActivitiesCount++;
		}

		alert(`Saved ${savedActivitiesCount} activities!`);
	}

	removeCompletedActivity(activity: Activity) {
		const idx = this.importedActivities().indexOf(activity);
		this.importedActivities().splice(idx, 1);
	}

	async saveNewActivities() {
		let savedActivitiesCount = 0;

		for (let idx = 0; idx < this.importedActivities().length; idx++) {
			const activity = this.importedActivities()[idx];
			const existingActivity = await this.activityRepository.getById(activity.id);

			if (existingActivity) {
				continue;
			}

			await this.importService.save(activity);
			this.removeCompletedActivity(activity);
			idx--;
			savedActivitiesCount++;
		}

		alert(`Saved ${savedActivitiesCount} activities!`);
	}

	cancelImportingActivities() {
		this.importedActivities().splice(0);
	}
}
