import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { NgIf } from '@angular/common';
import { ChartData, ChartOptions } from 'chart.js';
import { Analytics } from '../../types';
import { IssueOverview, ProjectOverview } from '../../../../dto';

@Component({
  selector: 'app-issue-ratio-chart',
  standalone: true,
	imports: [
		BaseChartDirective,
		NgIf,
	],
  templateUrl: './issue-ratio-chart.component.html',
  styleUrl: './issue-ratio-chart.component.scss'
})
export class IssueRatioChartComponent implements OnInit, OnChanges {
  load = false;

  data: ChartData<'pie', number[]> = {
    labels: [],
    datasets: [{
      data:[],
    }]
  };

  options: ChartOptions<'pie'> = {
    plugins: {
      title: {
        display: true,
        text: 'Issue Time Ratio'
      },
      legend: {
        position: 'bottom'
      },
    }
  };

  @Input()
  analytics!: Analytics;

  ngOnInit() {
    this.updateProjectDataset();

    setTimeout(() => {
      this.load = true;
    }, 200);
  }

  ngOnChanges() {
    this.updateProjectDataset();
  }

  updateProjectDataset() {
    this.resetDataset();

    const issueOverview = this.collectIssueOverview();

    for (const io of issueOverview) {
      this.data.labels?.push(io.issue.FullName);
      this.data.datasets[0].data.push(io.durationRatio);
    }
  }

  resetDataset() {
    this.data.labels = [];
    this.data = {
      labels: [],
      datasets: [{
        data:[],
      }]
    };
  }

  collectIssueOverview() {
    return this.analytics.projectOverview.reduce((result: IssueOverview[], projectOverview: ProjectOverview) => {
      result.push(...projectOverview.issues);
      return result;
    }, []);
  }
}
