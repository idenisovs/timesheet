import { Component } from '@angular/core';
import { Project } from '../../dto';
import { ProjectCardComponent } from './project-card/project-card.component';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [
    ProjectCardComponent,
    NgForOf
  ],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss'
})
export class ProjectsPageComponent {
  projects: Project[] = [{
    id: crypto.randomUUID().toString(),
    name: 'Timesheet',
    description: 'A time tracking application for personal use.',
    keys: 'TST',
    createdAt: new Date()
  }, {
    id: crypto.randomUUID().toString(),
    name: 'Money Saver',
    keys: 'MS',
    createdAt: new Date()
  }];
}
