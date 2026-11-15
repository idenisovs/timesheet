import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Dexie from 'dexie';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Project } from '@entities';
import { SaveProjectsWorkflowService } from '@workflows/save-projects/save-projects-workflow.service';

@Component({
    selector: 'app-create-project-modal',
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './create-project-modal.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './create-project-modal.component.scss'
})
export class CreateProjectModalComponent {
	private readonly modal = inject(NgbActiveModal);
	private readonly fb = inject(FormBuilder);
	private readonly saveProjects = inject(SaveProjectsWorkflowService);

  form = this.fb.group({
    name: [''],
    description: [''],
    keys: ['']
  });

  async create() {
    const rawValues = this.form.value;
    const rawKeys = rawValues.keys ?? '';

    const project = new Project();

    project.name = rawValues.name as string;
    project.description = rawValues.description as string;
    project.keys = rawKeys.split(',').map(key => key.trim());

    try {
      await this.saveProjects.run([project], []);

      this.modal.close(project);
    } catch (e) {
      const error = e as Error;

      if (error.name === Dexie.errnames.Constraint) {
        alert('Project name must be unique!');
      }
    }
  }

  cancel() {
    this.modal.close(null);
  }
}
