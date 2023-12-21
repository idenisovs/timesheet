import { Component, Input } from '@angular/core';
import { Sheet } from '../../../dto';
import { DatePipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-daily-activities-summary',
  standalone: true,
  imports: [
    NgIf,
    JsonPipe,
    NgForOf,
    DatePipe
  ],
  templateUrl: './daily-activities-summary.component.html',
  styleUrl: './daily-activities-summary.component.scss'
})
export class DailyActivitiesSummaryComponent {
  @Input()
  sheet?: Sheet;

  constructor(public activeModal: NgbActiveModal) {}
}
