import { Injectable } from '@angular/core';
import { SheetStoreService } from './sheet-store.service';
import { Issue } from '../dto';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {
  db = this.sheetStore.Instance;

  constructor(private sheetStore: SheetStoreService) { }

  getByKey(key: string) {
    return this.db.issues.where('key').startsWith(key).toArray();
  }

  sort(issue1: Issue, issue2: Issue) {
    if (issue1.createdAt > issue2.createdAt) {
      return -1;
    }

    if (issue1.createdAt < issue2.createdAt) {
      return 1;
    }

    if (issue1.key > issue2.key) {
      return -1;
    }

    if (issue1.key < issue2.key) {
      return 1;
    }

    return 0;
  }
}
