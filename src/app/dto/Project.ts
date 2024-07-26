import { ImportedProject } from '../pages/import-page/Imports';
import { ProjectEntity } from '../store/entities';

export class Project {
  id = crypto.randomUUID() as string;
  name = '';
  description?: string;
  keys: string[] = [];
  createdAt = new Date();

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
