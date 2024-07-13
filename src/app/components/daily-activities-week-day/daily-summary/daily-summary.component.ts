import { Component, Input } from '@angular/core';
import { Day } from '../../../dto';

@Component({
  selector: 'app-daily-summary',
  standalone: true,
  imports: [],
  templateUrl: './daily-summary.component.html',
  styleUrl: './daily-summary.component.scss'
})
export class DailySummaryComponent {
  @Input()
  day: Day = new Day();
}
