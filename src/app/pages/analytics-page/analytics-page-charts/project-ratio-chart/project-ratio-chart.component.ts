import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { NgIf, PercentPipe } from '@angular/common';
import { ChartData, ChartOptions, TooltipItem } from 'chart.js';
import parseDuration from 'parse-duration';

import { Analytics } from '../../types';
import { DurationService } from '../../../../services/duration.service';

@Component({
  selector: 'app-project-ratio-chart',
  standalone: true,
	imports: [
		BaseChartDirective,
		NgIf
	],
  providers: [PercentPipe],
  templateUrl: './project-ratio-chart.component.html',
  styleUrl: './project-ratio-chart.component.scss'
})
export class ProjectRatioChartComponent implements OnInit, OnChanges {
  load = false;

  data: ChartData <'pie', number[]> = {
    labels: [],
    datasets: [{
      data:[],
    }]
  };

  options: ChartOptions<'pie'> = {
    plugins: {
      title: {
        display: true,
        text: 'Projects Time Ratio'
      },
      legend: {
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: this.formatLabel.bind(this)
        }
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

    for (const po of this.analytics.projectOverview) {
      this.data.labels?.push(po.project.name);
      const duration = parseDuration(po.duration) as number;
      this.data.datasets[0].data.push(duration);
    }
  }

  formatLabel(item: TooltipItem<'pie'>): string {
    return this.duration.toStr(item.raw as number);
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
}
