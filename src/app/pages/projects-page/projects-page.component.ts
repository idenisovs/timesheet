import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { Project } from '../../dto';
import { ProjectCardComponent } from './project-card/project-card.component';
import { ActionsService } from '../../services/actions.service';
import { Actions } from '../../services/Actions';
import { CreateProjectModalComponent } from './create-project-modal/create-project-modal.component';
import { handleModalResult } from '../../utils';
import { ProjectRepositoryService } from '../../repository/project-repository.service';

@Component({
    selector: 'app-projects-page',
    imports: [
        ProjectCardComponent,
        NgForOf,
        NgIf,
    ],
    templateUrl: './projects-page.component.html',
    styleUrl: './projects-page.component.scss'
})
export class ProjectsPageComponent implements OnInit, OnDestroy {
  projects: Project[] = [];

  actionsSubscription?: Subscription;

  constructor(
    private modal: NgbModal,
    private actions: ActionsService,
    private projectsService: ProjectRepositoryService,
  ) {}

  async ngOnInit() {
    this.actionsSubscription = this.actions.on.subscribe(this.actionsHandler.bind(this));
    this.projects = await this.getOrderedProjects();
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

    const createdProject = await handleModalResult<Project | null>(createProjectModal.result);

    if (createdProject) {
      this.projects = await this.getOrderedProjects();
    }
  }

  private async getOrderedProjects() {
    const projects = await this.projectsService.getAll();
    projects.sort((a: Project, b: Project) => b.createdAt.getTime() - a.createdAt.getTime());
    return projects;
  }
}
