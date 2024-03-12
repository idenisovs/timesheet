import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Project } from '../../dto';
import { ProjectCardComponent } from './project-card/project-card.component';
import { ActionsService } from '../../services/actions.service';
import { Actions } from '../../services/Actions';
import { CreateProjectModalComponent } from './create-project-modal/create-project-modal.component';
import { handleModalResult } from '../../utils';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [
    ProjectCardComponent,
    NgForOf
  ],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss'
})
export class ProjectsPageComponent implements OnInit, OnDestroy {
  projects: Project[] = [{
    id: crypto.randomUUID().toString(),
    name: 'Timesheet',
    description: 'A time tracking application for personal use.',
    keys: ['TST'],
    createdAt: new Date()
  }, {
    id: crypto.randomUUID().toString(),
    name: 'Money Saver',
    keys: ['MS'],
    createdAt: new Date()
  }];

  actionsSubscription?: Subscription;

  constructor(
    private modal: NgbModal,
    private actions: ActionsService
  ) {}

  ngOnInit() {
    this.actionsSubscription = this.actions.on.subscribe(this.actionsHandler.bind(this));
  }

  ngOnDestroy() {
    this.actionsSubscription?.unsubscribe();
  }

  actionsHandler(action: Actions) {
    if (action === Actions.AddProject) {
      void this.showAddProjectModal();
    }
  }

  async showAddProjectModal() {
    const createProjectModal = this.modal.open(CreateProjectModalComponent);

    const createdProject = await handleModalResult<Project|null>(createProjectModal.result);

    console.log(createdProject);
  }
}
