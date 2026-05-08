import { Component, input } from '@angular/core';

@Component({
  selector: 'app-activity-times',
  imports: [],
  templateUrl: './activity-times.component.html',
  styleUrl: './activity-times.component.scss',
})
export class ActivityTimesComponent {
	from = input<string>();
	till = input<string>();
}
