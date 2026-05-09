import { Component } from '@angular/core';
import { PageActionButtonComponent } from '../../../components/page-action-button/page-action-button.component';
import { Actions } from '../../../services/Actions';

@Component({
    selector: 'app-issues-view-actions',
    imports: [
        PageActionButtonComponent
    ],
    templateUrl: './issues-view-actions.component.html',
    styleUrl: './issues-view-actions.component.scss'
})
export class IssuesViewActionsComponent {

  protected readonly Actions = Actions;
}
