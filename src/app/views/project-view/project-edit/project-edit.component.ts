import { Component, EventEmitter, inject, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Project } from '@entities';
import { SaveProjectsWorkflowService } from '@workflows/save-projects/save-projects-workflow.service';

@Component({
	selector: 'app-project-edit',
	imports: [
		ReactiveFormsModule,
	],
	templateUrl: './project-edit.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './project-edit.component.scss',
})
export class ProjectEditComponent implements OnInit {
	private readonly fb = inject(FormBuilder);
	private readonly saveProjects = inject(SaveProjectsWorkflowService);
	private readonly router = inject(Router);

	form = this.fb.group({
		name: [''],
		keys: [''],
		description: [''],
	});

	@Input()
	project!: Project;

	@Output()
	changes = new EventEmitter<Project>();

	@Output()
	cancel = new EventEmitter<void>();

	ngOnInit() {
		this.form.get('name')?.setValue(this.project.name);
		this.form.get('keys')?.setValue(this.project.keys.join(', '));
		this.form.get('description')?.setValue(this.project.description ?? null);
	}

	async save() {
		const project = new Project(this.project);

		project.id = this.project.id;
		project.name = this.form.get('name')?.value as string;
		project.description = this.form.get('description')?.value as string;
		project.keys = (this.form.get('keys')?.value as string).split(',').map(key => key.trim());

		await this.saveProjects.run([project], []);

		this.changes.emit(project);
	}

	async remove() {
		if (!this.project) {
			return;
		}

		if (!confirm(`Are you sure want to remove the project ${this.project.name}?`)) {
			return;
		}

		await this.saveProjects.run([], [this.project]);
		await this.router.navigate(['projects']);
	}
}
