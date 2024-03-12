import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectsService } from '../../../services/projects.service';
import { Project } from '../../../dto';

@Component({
  selector: 'app-create-project-modal',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './create-project-modal.component.html',
  styleUrl: './create-project-modal.component.scss'
})
export class CreateProjectModalComponent {
  form = this.fb.group({
    name: [''],
    description: [''],
    keys: ['']
  });

  constructor(
    private modal: NgbActiveModal,
    private fb: FormBuilder,
    private projects: ProjectsService,
  ) {}

  async create() {
    const rawValues = this.form.value;
    const rawKeys = rawValues.keys ?? '';

    const project: Omit<Project, 'id' | 'createdAt'> = {
      name: rawValues.name as string,
      description: rawValues.description as string,
      keys: rawKeys.split(',').map(key => key.trim())
    };

    const createdProject = await this.projects.create(project);

    this.modal.close(createdProject);
  }

  cancel() {
    this.modal.close(null);
  }
}
