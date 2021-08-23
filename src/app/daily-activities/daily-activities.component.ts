import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-daily-activities',
  templateUrl: './daily-activities.component.html',
  styleUrls: ['./daily-activities.component.scss']
})
export class DailyActivitiesComponent implements OnInit {
  today = new Date();

  constructor() { }

  ngOnInit(): void {
  }

}
