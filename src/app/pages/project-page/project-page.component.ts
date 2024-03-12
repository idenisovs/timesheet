import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../dto';
import { JsonPipe } from '@angular/common';

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

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(({ project }) => {
      this.project = project;
    });
  }
}
