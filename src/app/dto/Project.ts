import { ImportedProject } from '../pages/import-page/Imports';
import { ProjectEntity } from '../store/entities';

export class Project {
  id = crypto.randomUUID() as string;
  name = '';
  description?: string;
  keys: string[] = [];
  createdAt = new Date();

  equals(other: Project): boolean {
    if (this.id !== other.id) {
      return false;
    }

    if (this.name !== other.name || this.description !== other.description) {
      return false;
    }

    if (this.keys.length !== other.keys.length) {
      return false;
    }

    return this.keys.every((key: string) => other.keys.includes(key));
  }

  static fromImport(importedProject: ImportedProject): Project {
    const project = new Project();

    Object.assign(project, importedProject);

    project.keys = importedProject.keys.split(',').map((key: string) => key.trim());
    project.createdAt = new Date(importedProject.createdAt);

    return project;
  }

  static fromRecord(projectRecord: ProjectEntity): Project {
    const project = new Project();
    Object.assign(project, projectRecord);
    return project;
  }
}
