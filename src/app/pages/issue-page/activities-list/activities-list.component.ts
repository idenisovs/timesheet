import { Component, Input } from '@angular/core';
import { DatePipe, NgForOf } from '@angular/common';
import { IssueActivity } from '../../../dto';

@Component({
  selector: 'app-activities-list',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe
  ],
  templateUrl: './activities-list.component.html',
  styleUrl: './activities-list.component.scss'
})
export class ActivitiesListComponent {
  @Input()
  activities: IssueActivity[] = [];
}
