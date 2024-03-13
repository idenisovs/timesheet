import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
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
    RouterLink,
    NgForOf,
    NgIf
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
    private router: Router,
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

    this.project.name = this.form.get('name')?.value as string;
    this.project.description = this.form.get('description')?.value as string;
    this.project.keys = (this.form.get('keys')?.value as string).split(',').map(key => key.trim());

    await this.projects.update(this.project);

    this.service.getProjectIssues(this.project);
  }

  async remove() {
    if (!this.project) {
      return;
    }

    if (!confirm(`Are you sure want to remove the project ${this.project.name}?`)) {
      return;
    }

    await this.projects.remove(this.project);
    await this.router.navigate(['projects']);
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
      console.log('Issues arrived!');
      console.log(activities);
      this.activities = activities;
    });
  }
}
