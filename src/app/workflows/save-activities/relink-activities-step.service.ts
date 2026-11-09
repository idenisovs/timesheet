import { Service } from '@angular/core';
import { Step } from '@workflows/Step';
import {
	SaveActivitiesContext
} from '@workflows/save-activities/save-activities-context';

@Service()
export class RelinkActivitiesStepService implements Step<SaveActivitiesContext> {
    execute(context: SaveActivitiesContext): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
