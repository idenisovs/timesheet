import { Component, Input, OnInit } from '@angular/core';
import { Week } from '../../dto';

@Component({
  selector: 'app-daily-activities-week',
  templateUrl: './daily-activities-week.component.html',
  styleUrls: ['./daily-activities-week.component.scss']
})
export class DailyActivitiesWeekComponent implements OnInit {
  @Input()
  week?: Week;

  constructor() { }

  ngOnInit(): void {

  }
}
