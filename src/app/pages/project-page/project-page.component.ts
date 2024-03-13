import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { Project } from '../../dto';
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
export class ProjectPageComponent implements OnInit {
  project?: Project;

  constructor(
    private route: ActivatedRoute,
    private service: ProjectPageService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(({ project }) => {
      if (project) {
        this.project = project;
        this.service.getProjectIssues(project);
      }
    });
  }
}
