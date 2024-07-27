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
  status = DiffStatus.same;

  @Input()
  importedProject!: Project;

  existingProject: Project|null = null;

  constructor(
    private projectsRepository: ProjectRepositoryService
  ) {}

  async ngOnInit() {
    if (!this.importedProject) {
      return;
    }

    this.existingProject = await this.projectsRepository.getById(this.importedProject.id);

    if (!this.existingProject) {
      this.status = DiffStatus.new;
      return;
    }

    if (!this.existingProject.equals(this.importedProject)) {
      this.status = DiffStatus.updated;
      return;
    }

    this.status = DiffStatus.same;
  }

  async save() {
    await this.projectsRepository.create(this.importedProject);
    this.status = DiffStatus.same;
  }

  async update() {
    await this.projectsRepository.update(this.importedProject);
    this.status = DiffStatus.same;
  }

  getRowStyle() {
    switch (this.status) {
      case DiffStatus.new:
        return 'text-primary';
      case DiffStatus.updated:
        return 'text-success';
      default:
        return '';
    }
  }

  protected readonly DiffStatus = DiffStatus;
}
