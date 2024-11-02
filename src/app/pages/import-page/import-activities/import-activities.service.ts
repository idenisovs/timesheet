import { Injectable } from '@angular/core';

import { SaveActivitiesWorkflowService } from '../../../workflows/save-activities-workflow.service';
import { RemoveActivitiesWorkflowService } from '../../../workflows/remove-activities-workflow.service';
import { Activity } from '../../../dto';

@Injectable({
  providedIn: 'root'
})
export class ImportActivitiesService {
  constructor(
    private activitySaveWorkflow: SaveActivitiesWorkflowService,
    private activityRemoveWorkflow: RemoveActivitiesWorkflowService
  ) { }

  async save(activity: Activity): Promise<void> {
    await this.activitySaveWorkflow.run([activity])
  }

  async remove(activities: Activity[]): Promise<void> {
    const activityIds = activities.map(activity => activity.id);
    await this.activityRemoveWorkflow.run(activityIds);
  }
}
