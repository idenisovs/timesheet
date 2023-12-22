import { Component, Input, OnInit } from '@angular/core';
import { DatePipe, JsonPipe, KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Activity, Sheet } from '../../../dto';
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

  get ActiveActivities(): Activity[] {
    if (!this.sheet) {
      return [];
    }

    return this.sheet.activities.filter((activity) => !!activity.duration)
  }

  constructor(
    public activeModal: NgbActiveModal,
    private activityService: ActivitiesService
  ) {}

  ngOnInit() {
    if (!this.sheet) {
      return;
    }

    if (this.ActiveActivities.length) {
      this.tasks = this.activityService.groupByHeader(this.ActiveActivities);
    }
  }

  getShortName(activityName: string): string {
    return activityName.split(':').pop() ?? 'n/a';
  }
}
