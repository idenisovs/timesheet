import { Component, OnInit } from '@angular/core';
import { SheetStoreService } from '../../services/sheet-store.service';
import Sheet from '../../dto/Sheet';

@Component({
  selector: 'app-daily-activities-page',
  templateUrl: './daily-activities-page.component.html',
  styleUrls: ['./daily-activities-page.component.scss']
})
export class DailyActivitiesPageComponent implements OnInit {

  sheets: Sheet[] = [];

  constructor(private store: SheetStoreService) { }

  async ngOnInit() {
    await this.store.prepareForToday();
    this.sheets = await this.store.load();
  }

}
