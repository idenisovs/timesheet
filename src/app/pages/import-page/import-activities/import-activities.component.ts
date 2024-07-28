import { Component, Input } from '@angular/core';
import { NgForOf } from '@angular/common';

import { Activity } from '../../../dto';
import { ImportedIssueDiffComponent } from '../import-issues/imported-issue-diff/imported-issue-diff.component';
import { ImportedActivityDiffComponent } from './imported-activity-diff/imported-activity-diff.component';

@Component({
  selector: 'app-import-activities',
  standalone: true,
  imports: [
    ImportedIssueDiffComponent,
    NgForOf,
    ImportedActivityDiffComponent,
  ],
  templateUrl: './import-activities.component.html',
  styleUrl: './import-activities.component.scss'
})
export class ImportActivitiesComponent {
  @Input()
  importedActivities!: Activity[];

  removeCompletedActivity(activity: Activity) {
    const idx = this.importedActivities.indexOf(activity);
    this.importedActivities.splice(idx, 1);
  }
}
