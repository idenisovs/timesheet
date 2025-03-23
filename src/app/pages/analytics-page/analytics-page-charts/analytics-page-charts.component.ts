import { Component, Input } from '@angular/core';
import { Analytics } from '../types';
import { ProjectRatioChartComponent } from './project-ratio-chart/project-ratio-chart.component';
import { WeeksWorkedTimeComponent } from './weeks-worked-time/weeks-worked-time.component';
import { IssueRatioChartComponent } from './issue-ratio-chart/issue-ratio-chart.component';

@Component({
    selector: 'app-analytics-page-charts',
    imports: [
        ProjectRatioChartComponent,
        WeeksWorkedTimeComponent,
        IssueRatioChartComponent,
    ],
    templateUrl: './analytics-page-charts.component.html',
    styleUrl: './analytics-page-charts.component.scss'
})
export class AnalyticsPageChartsComponent {
	@Input()
	analytics!: Analytics;

	constructor() {}
}
