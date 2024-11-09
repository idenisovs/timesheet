import { Component, Input } from '@angular/core';
import { PercentPipe } from '@angular/common';

import { ActivityTotals } from '../../types';

@Component({
  selector: '[app-totals-row]',
  standalone: true,
  imports: [
    PercentPipe,
  ],
  templateUrl: './totals-row.component.html',
  styleUrl: './totals-row.component.scss'
})
export class TotalsRowComponent {
  @Input()
  totals: ActivityTotals = {
    activities: 0,
    time: '0',
    rate: 0
  };
}
