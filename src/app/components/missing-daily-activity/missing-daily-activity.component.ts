import { Component, Input } from '@angular/core';
import { Sheet } from '../../dto';

@Component({
  selector: 'app-missing-daily-activity',
  standalone: false,
  templateUrl: './missing-daily-activity.component.html',
  styleUrl: './missing-daily-activity.component.scss'
})
export class MissingDailyActivityComponent {
  @Input()
  sheet?: Sheet;
}
