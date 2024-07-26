import { Component, Input } from '@angular/core';
import { Project } from '../../../dto';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-import-projects',
  standalone: true,
  imports: [
    NgForOf,
  ],
  templateUrl: './import-projects.component.html',
  styleUrl: './import-projects.component.scss'
})
export class ImportProjectsComponent {
  @Input()
  projects: Project[] = [];
}
