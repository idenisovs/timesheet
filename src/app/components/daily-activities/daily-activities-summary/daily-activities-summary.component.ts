import { Component, Input, OnInit } from '@angular/core';
import { DatePipe, JsonPipe, KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Sheet } from '../../../dto';
import { ActivitiesService } from '../../../services/activities.service';
import { Task } from '../../../services/Task';

@Component({
  selector: 'app-daily-activities-summary',
  standalone: true,
  imports: [
    NgIf,
    JsonPipe,
    NgForOf,
    DatePipe,
    KeyValuePipe
  ],
  templateUrl: './daily-activities-summary.component.html',
  styleUrl: './daily-activities-summary.component.scss'
})
export class DailyActivitiesSummaryComponent implements OnInit {
  tasks = new Map<string, Task>();

  @Input()
  sheet?: Sheet;

  constructor(
    public activeModal: NgbActiveModal,
    private activityService: ActivitiesService
  ) {}

  ngOnInit() {
    if (!this.sheet) {
      return;
    }

    this.tasks = this.activityService.groupByHeader(this.sheet.activities);
  }

  getShortName(activityName: string): string {
    return activityName.split(':').pop() ?? 'n/a';
  }
}
