import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'timesheet';

  get IsUsingHttp(): boolean {
    return window.location.protocol === 'http:';
  }

  constructor() {}

  ngOnInit() {}
}
