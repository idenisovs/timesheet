import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Activity } from '@entities';

@Component({
    selector: 'app-activities-table',
    imports: [
    DatePipe
],
    templateUrl: './activities-table.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './activities-table.component.scss'
})
export class ActivitiesTableComponent {
  @Input()
  activities: Activity[] = [];
}
