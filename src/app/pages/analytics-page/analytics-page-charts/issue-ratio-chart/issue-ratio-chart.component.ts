import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

import { ChartData, ChartOptions, TooltipItem } from 'chart.js';
import parseDuration from 'parse-duration';

import { Analytics } from '../../types';
import { IssueOverview, ProjectOverview } from '../../../../dto';
import { DurationService } from '../../../../services/duration.service';
import { HOUR } from '../../../../constants';

interface IssueData {
  label: string;
  value: number;
}

@Component({
    selector: 'app-issue-ratio-chart',
    imports: [
    BaseChartDirective
],
    templateUrl: './issue-ratio-chart.component.html',
    styleUrl: './issue-ratio-chart.component.scss'
})
export class IssueRatioChartComponent implements OnInit, OnChanges {
  load = false;

  data: ChartData<'bar', number[]> = {
    labels: [],
    datasets: [{
      label: 'Hours',
      data:[],
    }]
  };

  options: ChartOptions<'bar'> = {
    plugins: {
      title: {
        display: true,
        text: 'Issue Time Ratio'
      },
      legend: {
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: this.formatLabel.bind(this)
        }
      },
    },
    scales: {
      x: {
        ticks: {
          callback: this.formatBarLabel.bind(this)
        }
      },
      y: {
        type: 'logarithmic'
      }
    }
  };

  @Input()
  analytics!: Analytics;

  constructor(private duration: DurationService) {}

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

    const issueOverviewList = this.collectIssueOverview();
    const issueData = this.extractIssueData(issueOverviewList)
      .sort((a, b) => {
        return b.value - a.value;
      });


    for (const issue of issueData) {
      this.data.labels?.push(issue.label);
      const hours = Math.round(issue.value / HOUR * 10) / 10;
      this.data.datasets[0].data.push(hours);
    }
  }

  resetDataset() {
    this.data.labels = [];
    this.data = {
      labels: [],
      datasets: [{
        label: 'Hours',
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

  extractIssueData(issueOverviewList: IssueOverview[]): IssueData[] {
    return issueOverviewList.map(issueOverview => ({
      label: issueOverview.issue.FullName,
      value: parseDuration(issueOverview.issue.duration) ?? 0
    }));
  }

  formatLabel(item: TooltipItem<'bar'>): string {
    return this.duration.toStr(item.raw as number * HOUR);
  }

  formatBarLabel(tick: string|number): string {
    if (typeof tick !== 'number') {
      return '';
    }

    const labels = this.data?.labels as string[]|undefined;

    if (!labels) {
      return '';
    }

    const label = labels[tick];

    if (label.includes(':')) {
      const [key] = label.split(':');
      return key;
    } else {
      return label;
    }
  }
}
