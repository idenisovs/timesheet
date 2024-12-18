import { Injectable } from '@angular/core';

import { SheetStoreService } from '../services/sheet-store.service';
import { Project } from '../dto';

@Injectable({
  providedIn: 'root'
})
export class ProjectRepositoryService {
  private db = this.store.Instance;

  constructor(private store: SheetStoreService) { }

  async create(project: Project): Promise<Project> {
    project.id = await this.db.projects.add(project);
    return project;
  }

  async update(project: Project): Promise<void> {
    await this.db.projects.put(project);
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
    return record ? Project.fromRecord(record) : null;
  }

  async getByName(projectName: string): Promise<Project|null> {
    const record = await this.db.projects.where('name').equals(projectName).first();
    return record ? Project.fromRecord(record) : null;
  }

  async getByKey(projectKey: string): Promise<Project | null> {
    const record = await this.db.projects.where('keys').equals(projectKey).first();
    return record ? Project.fromRecord(record) : null;
  }

  async getAllByKeys(projectKeys: string[]): Promise<Project[]> {
    const records = await this.db.projects.where('keys').anyOf(projectKeys).distinct().toArray();
    return records.map(Project.fromRecord);
  }
}
