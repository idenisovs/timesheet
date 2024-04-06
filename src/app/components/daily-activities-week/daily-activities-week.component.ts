import { Component, Input, OnInit } from '@angular/core';
import { Activity, Week } from '../../dto';
import { ActivitiesRepositoryService } from '../../repository/activities-repository.service';

@Component({
  selector: 'app-daily-activities-week',
  templateUrl: './daily-activities-week.component.html',
  styleUrls: ['./daily-activities-week.component.scss']
})
export class DailyActivitiesWeekComponent implements OnInit {
  @Input()
  week!: Week;

  activities: Activity[] = [];

  constructor(private activityRepo: ActivitiesRepositoryService) { }

  async ngOnInit() {
    this.activities = await this.activityRepo.getByWeek(this.week);
  }
}
