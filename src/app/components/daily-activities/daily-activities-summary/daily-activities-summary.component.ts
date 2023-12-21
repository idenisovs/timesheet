import { Component, Input, OnInit } from '@angular/core';
import { Sheet } from '../../../dto';
import { DatePipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivitiesService } from '../../../services/activities.service';
import { Task } from '../../../services/Task';

@Component({
  selector: 'app-daily-activities-summary',
  standalone: true,
  imports: [
    NgIf,
    JsonPipe,
    NgForOf,
    DatePipe
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

    console.log(this.tasks);
  }
}
