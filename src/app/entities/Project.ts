import { ImportedProject } from '@views/import-view/Imports';
import { ProjectRecord } from '@store/records';

export class Project {
	id = crypto.randomUUID() as string;
	name = '';
	description?: string;
	keys: string[] = [];
	createdAt = new Date();
	updatedAt = new Date();

	constructor(project?: Project) {
		if (project) {
			Object.assign(this, project);
		}
	}

	equals(other: Project): boolean {
		return this.name === other.name
			&& this.description === other.description
			&& this.keys.length === other.keys.length
			&& this.keys.every(key => other.keys.includes(key))
			&& this.createdAt.getTime() === other.createdAt.getTime()
			&& this.updatedAt.getTime() === other.updatedAt.getTime();
	}

	static fromImport(importedProject: ImportedProject): Project {
		const project = new Project();

		Object.assign(project, importedProject);

		project.keys = importedProject.keys.split(';').map((key: string) => key.trim());
		project.createdAt = new Date(importedProject.createdAt);
		project.updatedAt = new Date(importedProject.updatedAt);

		return project;
	}

	static fromRecord(projectRecord: ProjectRecord): Project {
		const project = new Project();
		Object.assign(project, projectRecord);
		return project;
	}
}
