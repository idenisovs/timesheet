import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { NgIf } from '@angular/common';
import { ChartData, ChartOptions, TooltipItem } from 'chart.js';
import parseDuration from 'parse-duration';

import { Analytics } from '../../types';
import { IssueOverview, ProjectOverview } from '../../../../dto';
import { DurationService } from '../../../../services/duration.service';
import { HOUR } from '../../../../constants';

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

    const issueOverview = this.collectIssueOverview();

    for (const io of issueOverview) {
      this.data.labels?.push(io.issue.FullName);
      const duration = parseDuration(io.duration) as number;
      const hours = Math.round(duration / HOUR * 10) / 10;
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
