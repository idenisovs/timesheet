import { Component } from '@angular/core';
import { Actions } from '../../../services/Actions';
import { PageActionButtonComponent } from '../../../components/page-action-button/page-action-button.component';

@Component({
    selector: 'app-daily-activities-view-actions',
    imports: [
        PageActionButtonComponent
    ],
    templateUrl: './daily-activities-view-actions.component.html',
    styleUrl: './daily-activities-view-actions.component.scss'
})
export class DailyActivitiesViewActionsComponent {
  protected readonly Actions = Actions;
}
