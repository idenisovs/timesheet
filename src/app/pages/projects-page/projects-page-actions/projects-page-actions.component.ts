import { Component } from '@angular/core';
import { Actions } from '../../../services/Actions';
import { PageActionButtonComponent } from '../../../components/page-action-button/page-action-button.component';

@Component({
  selector: 'app-projects-page-actions',
  standalone: true,
  imports: [
    PageActionButtonComponent
  ],
  templateUrl: './projects-page-actions.component.html',
  styleUrl: './projects-page-actions.component.scss'
})
export class ProjectsPageActionsComponent {

  protected readonly Actions = Actions;
}
