import { Component } from '@angular/core';
import { Actions } from '../../../services/Actions';
import { PageActionButtonComponent } from '../../../components/page-action-button/page-action-button.component';

@Component({
  selector: 'app-daily-activities-page-actions',
  standalone: true,
  imports: [
    PageActionButtonComponent
  ],
  templateUrl: './daily-activities-page-actions.component.html',
  styleUrl: './daily-activities-page-actions.component.scss'
})
export class DailyActivitiesPageActionsComponent {
  protected readonly Actions = Actions;
}
