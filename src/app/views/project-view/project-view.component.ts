import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import { Issue, Project } from '../../entities';
import { ProjectViewService } from './project-view.service';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { ProjectIssuesComponent } from './project-issues/project-issues.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-project-view',
    imports: [
    ReactiveFormsModule,
    ProjectEditComponent,
    ProjectIssuesComponent,
    ProjectDetailsComponent
],
    templateUrl: './project-view.component.html',
    styleUrl: './project-view.component.scss'
})
export class ProjectViewComponent implements OnInit, OnDestroy {
  project?: Project;
  issues: Issue[] = [];
  routeDataSubscription!: Subscription;
  isEditMode = false;
  isIssuesReady = false;

  constructor(
    private route: ActivatedRoute,
    private service: ProjectViewService,
  ) {}

  ngOnInit() {
    this.isEditMode = false;
    this.routeDataSubscription = this.subscribeToRouteData();
  }

  ngOnDestroy() {
    this.routeDataSubscription.unsubscribe();
  }

  async handleProjectChanges(changes: Project) {
    await this.updateProjectData(changes);
    this.toggleEditMode();
  }

  async updateProjectData(project: Project) {
    this.project = project;
    this.issues = await this.service.getProjectIssues(project);
    this.isIssuesReady = true;
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  private subscribeToRouteData() {
    return this.route.data.subscribe(async ({ project }) => {
      if (project) {
        await this.updateProjectData(project);
      }
    });
  }
}
