import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Issue, Project } from '../../dto';
import { ProjectPageService } from './project-page.service';
import { IssuesTableComponent } from '../issues-page/issues-table/issues-table.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';

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
    ProjectEditComponent
  ],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.scss'
})
export class ProjectPageComponent implements OnInit, OnDestroy {


  project?: Project;
  issues: Issue[] = [];
  routeDataSubscription = this.subscribeToRouteData();

  constructor(
    private route: ActivatedRoute,
    private service: ProjectPageService,
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.routeDataSubscription.unsubscribe();
  }

  async updateProjectData(project: Project) {
    this.project = project;

    this.issues = await this.service.getProjectIssues(project);
  }

  private subscribeToRouteData() {
    return this.route.data.subscribe(async ({ project }) => {
      if (project) {
        await this.updateProjectData(project);
      }
    });
  }
}
