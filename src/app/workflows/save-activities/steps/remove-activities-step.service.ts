import { Service } from '@angular/core';
import { SaveActivitiesContext } from '@workflows/save-activities/save-activities-context';
import { Step } from '@workflows/Step';

@Service()
export class RemoveActivitiesStepService implements Step<SaveActivitiesContext> {
	async execute(context: SaveActivitiesContext): Promise<void> {
		const { activitiesToRemove } = context;
		console.log(activitiesToRemove);
	}
}
