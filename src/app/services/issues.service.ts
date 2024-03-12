import { Injectable } from '@angular/core';
import { SheetStoreService } from './sheet-store.service';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {
  db = this.sheetStore.Instance;

  constructor(private sheetStore: SheetStoreService) { }

  getByKey(key: string) {
    return this.db.issues.where('key').startsWith(key).toArray();
  }
}
