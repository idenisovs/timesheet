import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../../../dto';
import { NgForOf } from '@angular/common';
import { ImportedProjectDiffComponent } from './imported-project-diff/imported-project-diff.component';

@Component({
  selector: 'app-import-projects',
  standalone: true,
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

  ngOnInit() {
    this.importedProjects.forEach((p) => console.log(p));
  }
}
