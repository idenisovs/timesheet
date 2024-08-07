import { Component, Input, OnInit } from '@angular/core';

import { Day, Week } from '../../dto';
import { DaysRepositoryService } from '../../repository/days-repository.service';

@Component({
  selector: 'app-daily-activities-week',
  templateUrl: './daily-activities-week.component.html',
  styleUrls: ['./daily-activities-week.component.scss']
})
export class DailyActivitiesWeekComponent implements OnInit {
  @Input()
  week!: Week;

  days: Day[] = [];

  constructor(
    private dayRepository: DaysRepositoryService
  ) { }

  async ngOnInit() {
    if (!this.week) {
      return;
    }

    this.days = await this.dayRepository.getByWeek(this.week);
  }
}
