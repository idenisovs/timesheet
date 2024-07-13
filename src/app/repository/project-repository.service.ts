import { Injectable } from '@angular/core';
import { SheetStoreService } from '../services/sheet-store.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectRepositoryService {
  private db = this.store.Instance;

  constructor(private store: SheetStoreService) { }

  async getAll() {
    return this.db.projects.toArray();
  }
}
