import { Component } from '@angular/core';
import { PageActionButtonComponent } from '../../../components/page-action-button/page-action-button.component';
import { Actions } from '../../../services/Actions';

@Component({
  selector: 'app-issues-page-actions',
  standalone: true,
  imports: [
    PageActionButtonComponent
  ],
  templateUrl: './issues-page-actions.component.html',
  styleUrl: './issues-page-actions.component.scss'
})
export class IssuesPageActionsComponent {

  protected readonly Actions = Actions;
}
