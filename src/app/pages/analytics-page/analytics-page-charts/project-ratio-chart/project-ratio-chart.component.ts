import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { NgIf, PercentPipe } from '@angular/common';
import { ChartData, ChartOptions, TooltipItem } from 'chart.js';

import { Analytics } from '../../types';

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

  constructor(private percentPipe: PercentPipe) {}

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
    this.data.labels = [];
    this.data = {
      labels: [],
      datasets: [{
        data:[],
      }]
    };

    for (const po of this.analytics.projectOverview) {
      this.data.labels?.push(po.project.name);
      this.data.datasets[0].data.push(po.durationRatio);
    }
  }

  formatLabel(item: TooltipItem<'pie'>): string {
    return this.percentPipe.transform(item.raw as number) as string;
  }
}
