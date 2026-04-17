import { Component, inject, input, OnInit, output } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';

import { Project } from '../../../../entities';
import { ProjectRepositoryService } from '../../../../repository/project-repository.service';
import { DiffStatus } from '../../DiffStatus';

@Component({
	selector: 'app-imported-project-diff',
	imports: [
		NgClass,
		DatePipe,
	],
	templateUrl: './imported-project-diff.component.html',
	styleUrl: './imported-project-diff.component.scss',
})
export class ImportedProjectDiffComponent implements OnInit {
	private projectsRepository = inject(ProjectRepositoryService);

	importedProject = input.required<Project>();
	completed = output<Project>();

	status = DiffStatus.same;
	existingProject: Project | null = null;

	async ngOnInit() {
		this.existingProject = await this.getExistingProject();
		this.status = this.getDiffStatus();

		if (this.status === DiffStatus.same) {
			this.completed.emit(this.importedProject());
		}
	}

	async getExistingProject(): Promise<Project | null> {
		const existingProject = await this.projectsRepository.getById(this.importedProject().id);

		if (existingProject) {
			return existingProject;
		}

		return this.projectsRepository.getByName(this.importedProject().name);
	}

	getDiffStatus(): DiffStatus {
		if (!this.existingProject) {
			return DiffStatus.new;
		}

		if (!this.existingProject.equals(this.importedProject())) {
			return DiffStatus.updated;
		}

		return DiffStatus.same;
	}

	async save() {
		await this.projectsRepository.create(this.importedProject());
		this.status = DiffStatus.same;
		this.completed.emit(this.importedProject());
	}

	async update() {
		if (!this.existingProject) {
			return;
		}

		const project = this.importedProject();
		project.id = this.existingProject.id;
		await this.projectsRepository.update(project);
		this.completed.emit(project);
	}

	async cancel() {
		this.completed.emit(this.importedProject());
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
