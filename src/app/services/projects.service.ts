import { Injectable } from '@angular/core';
import { SheetStoreService } from './sheet-store.service';
import SheetStore from '../store/SheetStore';
import { Project } from '../dto';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  db: SheetStore = this.sheetStore.Instance;

  constructor(private sheetStore: SheetStoreService) { }

  getAll() {
    this.db.projects.orderBy('createdAt').reverse().toArray();
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
