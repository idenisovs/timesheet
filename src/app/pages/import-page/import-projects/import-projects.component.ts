import { Component, Input, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';

import { Project } from '../../../dto';
import { ImportedProjectDiffComponent } from './imported-project-diff/imported-project-diff.component';

@Component({
    selector: 'app-import-projects',
    imports: [
        NgForOf,
        ImportedProjectDiffComponent,
    ],
    templateUrl: './import-projects.component.html',
    styleUrl: './import-projects.component.scss'
})
export class ImportProjectsComponent implements OnInit {
  @Input()
  importedProjects: Project[] = [];

  ngOnInit() {}

  removeCompletedProject(project: Project) {
    const idx = this.importedProjects.indexOf(project);
    this.importedProjects.splice(idx, 1);
  }
}
