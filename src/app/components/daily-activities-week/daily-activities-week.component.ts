import { Component, Input, OnInit } from '@angular/core';
import { Activity, Week } from '../../dto';
import { ActivitiesRepositoryService } from '../../repository/activities-repository.service';
import { Day } from '../../dto/Day';
import { DaysRepositoryService } from '../../repository/days-repository.service';

@Component({
  selector: 'app-daily-activities-week',
  templateUrl: './daily-activities-week.component.html',
  styleUrls: ['./daily-activities-week.component.scss']
})
export class DailyActivitiesWeekComponent implements OnInit {
  @Input()
  week!: Week;

  constructor() { }

  async ngOnInit() {}
}
