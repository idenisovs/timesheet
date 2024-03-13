import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { Activity, Project } from '../../dto';
import { ProjectPageService } from './project-page.service';

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [
    JsonPipe
  ],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.scss'
})
export class ProjectPageComponent implements OnInit, OnDestroy {
  project?: Project;
  activities: Activity[] = [];
  issuesArrivedSubscription = this.subscribeToIssuesEvent();
  routeDataSubscription = this.subscribeToRouteData();

  constructor(
    private route: ActivatedRoute,
    private service: ProjectPageService
  ) {}

  ngOnInit() {
  }

  ngOnDestroy() {
    this.issuesArrivedSubscription.unsubscribe();
    this.routeDataSubscription.unsubscribe();
  }

  private subscribeToRouteData() {
    return this.route.data.subscribe(({ project }) => {
      if (project) {
        this.project = project;
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
