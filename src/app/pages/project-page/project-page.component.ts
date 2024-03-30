import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Issue, Project } from '../../dto';
import { ProjectPageService } from './project-page.service';
import { IssuesTableComponent } from '../issues-page/issues-table/issues-table.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { ProjectIssuesComponent } from './project-issues/project-issues.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    RouterLink,
    NgForOf,
    NgIf,
    IssuesTableComponent,
    ProjectEditComponent,
    ProjectIssuesComponent,
    ProjectDetailsComponent
  ],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.scss'
})
export class ProjectPageComponent implements OnInit, OnDestroy {
  project?: Project;
  issues: Issue[] = [];
  routeDataSubscription = this.subscribeToRouteData();
  isEditMode = false;

  constructor(
    private route: ActivatedRoute,
    private service: ProjectPageService,
  ) {}

  ngOnInit() {
    this.isEditMode = false;
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
