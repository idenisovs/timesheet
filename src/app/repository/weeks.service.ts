import { Injectable } from '@angular/core';
import { Week } from '../dto';
import { SheetStoreService } from '../services/sheet-store.service';

@Injectable({
  providedIn: 'root'
})
export class WeeksService {
  private db = this.store.Instance;

  constructor(private store: SheetStoreService) { }

  getAll(): Promise<Week[]> {
    return this.db.weeks.orderBy('till').reverse().toArray();
  }
}
