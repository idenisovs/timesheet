import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../../../../dto';
import { ProjectRepositoryService } from '../../../../repository/project-repository.service';
import { DiffStatus } from '../../DiffStatus';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-imported-project-diff',
  standalone: true,
  imports: [
    NgClass,
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
    }
  }

  protected readonly DiffStatus = DiffStatus;
}
