import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatePipe, PercentPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Issue, Project } from '../../../dto';
import { IssuesService } from '../../../services/issues.service';

@Component({
    selector: 'app-project-details',
    imports: [
    PercentPipe,
    DatePipe,
    RouterLink
],
    templateUrl: './project-details.component.html',
    styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent implements OnInit {
  totalDuration: string = '';
  averageAccuracy: number = 0;
  averageAccuracyRate: number = 0;

  @Input()
  project!: Project;

  @Input()
  issues!: Issue[];

  @Output()
  edit = new EventEmitter<void>();

  constructor(private issuesService: IssuesService) {}

  ngOnInit() {
    this.totalDuration = this.issuesService.calculateDuration(this.issues);
    this.averageAccuracy = this.issuesService.calculateAverageAccuracy(this.issues);
    this.averageAccuracyRate = this.averageAccuracy / 1000;
  }
}
