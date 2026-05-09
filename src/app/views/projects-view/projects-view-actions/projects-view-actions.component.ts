import { Component } from '@angular/core';
import { Actions } from '../../../services/Actions';
import { PageActionButtonComponent } from '../../../components/page-action-button/page-action-button.component';

@Component({
    selector: 'app-projects-view-actions',
    imports: [
        PageActionButtonComponent
    ],
    templateUrl: './projects-view-actions.component.html',
    styleUrl: './projects-view-actions.component.scss'
})
export class ProjectsViewActionsComponent {

  protected readonly Actions = Actions;
}
