import { Component } from '@angular/core';
import { ActionsService } from '../../../services/actions.service';
import { Actions } from '../../../services/Actions';

@Component({
  selector: 'app-daily-activities-page-actions',
  standalone: true,
  imports: [],
  templateUrl: './daily-activities-page-actions.component.html',
  styleUrl: './daily-activities-page-actions.component.scss'
})
export class DailyActivitiesPageActionsComponent {
  constructor(private actions: ActionsService) {}

  importFromCsv() {
    this.actions.on.emit(Actions.ImportFromCsv);
  }

  exportToCsv() {
    this.actions.on.emit(Actions.ExportToCsv);
  }
}
