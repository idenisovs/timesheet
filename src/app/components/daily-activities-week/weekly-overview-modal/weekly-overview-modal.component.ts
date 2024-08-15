import {Component, Input} from '@angular/core';
import {DatePipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Week} from "../../../dto";

@Component({
  selector: 'app-weekly-overview-modal',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    JsonPipe
  ],
  templateUrl: './weekly-overview-modal.component.html',
  styleUrl: './weekly-overview-modal.component.scss'
})
export class WeeklyOverviewModalComponent {
  @Input()
  week!: Week;

  constructor(public modal: NgbActiveModal) {}
}
