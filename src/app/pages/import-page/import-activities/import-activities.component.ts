import { Component, Input } from '@angular/core';
import { Activity } from '../../../dto';

@Component({
  selector: 'app-import-activities',
  standalone: true,
  imports: [],
  templateUrl: './import-activities.component.html',
  styleUrl: './import-activities.component.scss'
})
export class ImportActivitiesComponent {
  @Input()
  importedActivities!: Activity[];
}
