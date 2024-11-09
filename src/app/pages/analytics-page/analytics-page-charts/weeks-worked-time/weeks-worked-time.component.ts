import { Component, Input } from '@angular/core';
import { Analytics } from '../../types';

@Component({
  selector: 'app-weeks-worked-time',
  standalone: true,
  imports: [],
  templateUrl: './weeks-worked-time.component.html',
  styleUrl: './weeks-worked-time.component.scss'
})
export class WeeksWorkedTimeComponent {
  @Input()
  analytics!: Analytics;
}
