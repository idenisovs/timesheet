import { Injectable } from '@angular/core';

import { SheetStoreService } from '../services/sheet-store.service';
import { Project } from '../dto';

@Injectable({
  providedIn: 'root'
})
export class ProjectRepositoryService {
  private db = this.store.Instance;

  constructor(private store: SheetStoreService) { }

  async getAll() {
    return this.db.projects.toArray();
  }

  async getById(projectId: string): Promise<Project|null> {
    const record = await this.db.projects.where('id').equals(projectId).first();

    if (record) {
      return Project.fromRecord(record);
    }

    return null;
  }
}
