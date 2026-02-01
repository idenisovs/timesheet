import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';

import { Project } from '../../../../dto';
import { ProjectRepositoryService } from '../../../../repository/project-repository.service';
import { DiffStatus } from '../../DiffStatus';

@Component({
    selector: 'app-imported-project-diff',
    imports: [
    NgClass,
    DatePipe
],
    templateUrl: './imported-project-diff.component.html',
    styleUrl: './imported-project-diff.component.scss'
})
export class ImportedProjectDiffComponent implements OnInit {
  status = DiffStatus.same;
  existingProject: Project|null = null;

  @Input()
  importedProject!: Project;

  @Output()
  completed = new EventEmitter<Project>();

  constructor(
    private projectsRepository: ProjectRepositoryService
  ) {}

  async ngOnInit() {
    if (!this.importedProject) {
      return;
    }

    this.existingProject = await this.getExistingProject();

    this.status = this.getDiffStatus();

    if (this.status === DiffStatus.same) {
      this.completed.emit(this.importedProject);
    }
  }

  async getExistingProject(): Promise<Project|null> {
    let existingProject = await this.projectsRepository.getById(this.importedProject.id);

    if (existingProject) {
      return existingProject;
    }

    return this.projectsRepository.getByName(this.importedProject.name);
  }

  getDiffStatus(): DiffStatus {
    if (!this.existingProject) {
      return DiffStatus.new;
    }

    if (!this.existingProject.equals(this.importedProject)) {
      return DiffStatus.updated;
    }

    return DiffStatus.same;
  }

  async save() {
    await this.projectsRepository.create(this.importedProject);
    this.status = DiffStatus.same;
    this.completed.emit(this.importedProject);
  }

  async update() {
    if (!this.existingProject) {
      return;
    }

    this.importedProject.id = this.existingProject.id;
    await this.projectsRepository.update(this.importedProject);
    this.completed.emit(this.importedProject);
  }

  async cancel() {
    this.completed.emit(this.importedProject);
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
