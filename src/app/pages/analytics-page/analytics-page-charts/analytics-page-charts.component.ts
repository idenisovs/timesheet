import { Component, Input } from '@angular/core';
import { Analytics } from '../types';

@Component({
  selector: 'app-analytics-page-charts',
  standalone: true,
  imports: [],
  templateUrl: './analytics-page-charts.component.html',
  styleUrl: './analytics-page-charts.component.scss'
})
export class AnalyticsPageChartsComponent {
  @Input()
  analytics!: Analytics;
}
