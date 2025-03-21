import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { HOUR } from '../../../../constants';
import { Analytics } from '../../types';

@Component({
    selector: 'app-weeks-worked-time',
    imports: [
        BaseChartDirective,
        NgIf,
    ],
    templateUrl: './weeks-worked-time.component.html',
    styleUrl: './weeks-worked-time.component.scss'
})
export class WeeksWorkedTimeComponent implements OnInit, OnChanges {
  load = false;

  data: ChartData<'bar', number[]> = {
    labels: [],
    datasets: [{
      label: 'Hours',
      data: []
    }]
  };

  options: ChartOptions<'bar'> = {
    plugins: {
      title: {
        display: true,
        text: 'Weekly Tracked Time'
      },
      legend: {
        position: 'bottom'
      }
    }
  };

  @Input()
  analytics!: Analytics;

  hours: number[] = [];

  constructor() {}

  ngOnInit() {
    this.updateDataset();

    setTimeout(() => {
      this.load = true;
    }, 200);
  }

  ngOnChanges() {
    this.updateDataset();
  }

  updateDataset() {
    this.resetDataset();

    const weekNumbers = Array.from(this.analytics.weeklyHours.keys());
    const startingWeek = Math.min(...weekNumbers);
    const endingWeek = Math.max(...weekNumbers);

    for (let weekNr = startingWeek; weekNr <= endingWeek; weekNr++) {
      this.data.labels?.push(`Week ${weekNr}`);
      const hours = this.getHoursValue(weekNr)
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

  getHoursValue(weekNr: number): number {
    const timeMs = this.analytics.weeklyHours.get(weekNr) as number;
    const hours = timeMs / HOUR;
    return Math.round(hours * 10) / 10;
  }
}
