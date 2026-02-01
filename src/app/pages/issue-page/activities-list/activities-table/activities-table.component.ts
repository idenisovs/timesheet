import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Activity } from '../../../../dto';

@Component({
    selector: 'app-activities-table',
    imports: [
    DatePipe
],
    templateUrl: './activities-table.component.html',
    styleUrl: './activities-table.component.scss'
})
export class ActivitiesTableComponent {
  @Input()
  activities: Activity[] = [];
}
