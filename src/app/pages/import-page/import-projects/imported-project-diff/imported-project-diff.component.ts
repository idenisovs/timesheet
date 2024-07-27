import { Component, Input, OnInit } from '@angular/core';
import { DatePipe, NgClass, NgIf } from '@angular/common';

import { Project } from '../../../../dto';
import { ProjectRepositoryService } from '../../../../repository/project-repository.service';
import { DiffStatus } from '../../DiffStatus';

@Component({
  selector: 'app-imported-project-diff',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    DatePipe,
  ],
  templateUrl: './imported-project-diff.component.html',
  styleUrl: './imported-project-diff.component.scss'
})
export class ImportedProjectDiffComponent implements OnInit {
  status = DiffStatus.no_changes;

  @Input()
  importedProject!: Project;

  existingProject: Project|null = null;

  constructor(private projectsRepository: ProjectRepositoryService) {}

  async ngOnInit() {
    if (!this.importedProject) {
      return;
    }

    this.existingProject = await this.projectsRepository.getById(this.importedProject.id);

    if (!this.existingProject) {
      this.status = DiffStatus.created;
      return;
    }

    if (!this.existingProject.equals(this.importedProject)) {
      this.status = DiffStatus.changed;
      return;
    }

    this.status = DiffStatus.no_changes;
  }

  protected readonly DiffStatus = DiffStatus;
}
