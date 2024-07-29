import { Injectable } from '@angular/core';

import SheetStore from '../store/SheetStore';

@Injectable({
  providedIn: 'root'
})
export class SheetStoreService {
  private db = new SheetStore();

  public get Instance(): SheetStore {
    return this.db;
  }

  constructor() {
    this.db.open().then(() => {});
  }
}
