import { Injectable } from '@angular/core';

import { SheetStoreService } from '../services/sheet-store.service';
import { Project } from '../dto';

@Injectable({
  providedIn: 'root'
})
export class ProjectRepositoryService {
  private db = this.store.Instance;

  constructor(private store: SheetStoreService) { }

  async create(project: Project): Promise<void> {
    await this.db.projects.add(project);
  }

  async update(project: Project): Promise<void> {
    await this.db.projects.update(project.id, project)
  }

  async remove(project: Project): Promise<void> {
    await this.db.projects.delete(project.id);
  }

  async getAll() {
    const records = await this.db.projects.toArray();

    return records.map(Project.fromRecord);
  }

  async getById(projectId: string): Promise<Project|null> {
    const record = await this.db.projects.where('id').equals(projectId).first();

    if (record) {
      return Project.fromRecord(record);
    }

    return null;
  }
}
