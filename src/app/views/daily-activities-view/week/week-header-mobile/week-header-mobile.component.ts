import { Component } from '@angular/core';
import { WeekHeaderComponent } from '../week-header/week-header.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-week-header-mobile',
	imports: [
		DatePipe,
	],
  templateUrl: './week-header-mobile.component.html',
  styleUrl: './week-header-mobile.component.scss',
})
export class WeekHeaderMobileComponent extends WeekHeaderComponent {

}
