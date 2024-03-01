import { Component, Input } from '@angular/core';
import { DatePipe, NgForOf } from '@angular/common';
import { IssueActivity } from '../../../../dto';

@Component({
  selector: 'app-activities-table',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf
  ],
  templateUrl: './activities-table.component.html',
  styleUrl: './activities-table.component.scss'
})
export class ActivitiesTableComponent {
  @Input()
  activities: IssueActivity[] = [];
}
