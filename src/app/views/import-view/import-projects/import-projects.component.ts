import { Component, Input } from '@angular/core';


import { Project } from '../../../entities';
import { ImportedProjectDiffComponent } from './imported-project-diff/imported-project-diff.component';

@Component({
	selector: 'app-import-projects',
	imports: [
		ImportedProjectDiffComponent,
	],
	templateUrl: './import-projects.component.html',
	styleUrl: './import-projects.component.scss',
})
export class ImportProjectsComponent {
	@Input()
	importedProjects: Project[] = [];

	removeCompletedProject(project: Project) {
		const idx = this.importedProjects.indexOf(project);
		this.importedProjects.splice(idx, 1);
	}
}
