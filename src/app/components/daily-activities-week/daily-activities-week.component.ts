import { Component, Input, OnInit } from '@angular/core';

import { ActivitySummary, Day, Week } from '../../dto';
import { DaysRepositoryService } from '../../repository/days-repository.service';
import { ActivitiesRepositoryService } from '../../repository/activities-repository.service';
import { ActivitiesService } from '../../services/activities.service';

@Component({
    selector: 'app-daily-activities-week',
    templateUrl: './daily-activities-week.component.html',
    styleUrls: ['./daily-activities-week.component.scss'],
    standalone: false
})
export class DailyActivitiesWeekComponent implements OnInit {
  days: Day[] = [];
  summary = new ActivitySummary();

  @Input()
  week!: Week;

  constructor(
    private dayRepository: DaysRepositoryService,
    private activityRepository: ActivitiesRepositoryService,
    private activitiesService: ActivitiesService
  ) { }

  async ngOnInit() {
    if (!this.week) {
      return;
    }

    this.days = await this.dayRepository.getByWeek(this.week);
    await this.recalculateActivitySummary();
  }

  async recalculateActivitySummary() {
    const activities = await this.activityRepository.getByWeek(this.week);

    this.summary = this.activitiesService.getActivitySummary(activities);
  }
}
