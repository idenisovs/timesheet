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

  getAll() {
    return this.db.projects.orderBy('createdAt').reverse().toArray();
  }

  getById(projectId: string) {
    return this.db.projects.get(projectId);
  }

  async create(project: Omit<Project, 'id' | 'createdAt'>) {
    const record: Project = {
      ...project,
      id: crypto.randomUUID().toString(),
      createdAt: new Date()
    };

    await this.db.projects.add(record);

    return record;
  }
}
