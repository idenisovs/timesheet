import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatePipe, NgForOf, NgIf, PercentPipe } from '@angular/common';
import { Issue, Project } from '../../../dto';
import { IssuesService } from '../../../services/issues.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    NgIf,
    PercentPipe,
    DatePipe,
    NgForOf
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
