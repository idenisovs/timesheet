import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { Activity, Project } from '../../dto';
import { ProjectPageService } from './project-page.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.scss'
})
export class ProjectPageComponent implements OnInit, OnDestroy {
  form = this.fb.group({
    name: [''],
    keys: [''],
    description: ['']
  });

  project?: Project;
  activities: Activity[] = [];
  issuesArrivedSubscription = this.subscribeToIssuesEvent();
  routeDataSubscription = this.subscribeToRouteData();

  constructor(
    private route: ActivatedRoute,
    private service: ProjectPageService,
    private projects: ProjectsService,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
  }

  ngOnDestroy() {
    this.issuesArrivedSubscription.unsubscribe();
    this.routeDataSubscription.unsubscribe();
  }

  async save() {
    if (!this.project) {
      return;
    }

    const update = { ...this.project };

    update.name = this.form.get('name')?.value as string;
    update.description = this.form.get('description')?.value as string;
    update.keys = (this.form.get('keys')?.value as string).split(',').map(key => key.trim());

    await this.projects.update(update);
  }

  private subscribeToRouteData() {
    return this.route.data.subscribe(({ project }) => {
      if (project) {
        this.project = project;

        this.form.get('name')?.setValue(project.name);
        this.form.get('keys')?.setValue(project.keys.join(', '));
        this.form.get('description')?.setValue(project.description);

        this.service.getProjectIssues(project);
      }
    });
  }

  private subscribeToIssuesEvent() {
    return this.service.IssuesArrived.subscribe((activities: Activity[]) => {
      this.activities = activities;

      console.log(this.activities);
    });
  }
}
