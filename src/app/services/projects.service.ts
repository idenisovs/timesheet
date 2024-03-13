import { Injectable } from '@angular/core';
import { SheetStoreService } from './sheet-store.service';
import SheetStore from '../store/SheetStore';
import { Project } from '../dto';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private db: SheetStore = this.sheetStore.Instance;

  constructor(private sheetStore: SheetStoreService) { }

  getAll(): Promise<Project[]> {
    return this.db.projects.orderBy('createdAt').reverse().toArray();
  }

  getById(projectId: string): Promise<Project|undefined> {
    return this.db.projects.get(projectId);
  }

  async create(project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
    const record: Project = {
      ...project,
      id: crypto.randomUUID().toString(),
      createdAt: new Date()
    };

    await this.db.projects.add(record);

    return record;
  }

  async update(project: Project): Promise<void> {
    await this.db.projects.update(project.id, project)
  }

  async remove(project: Project): Promise<void> {
    await this.db.projects.delete(project.id);
  }
}
