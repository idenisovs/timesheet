import { Component, OnInit } from '@angular/core';
import { SheetStoreService } from '../../services/sheet-store.service';
import { Activity, CsvRecord, Sheet } from '../../dto';
import { SheetCsvService } from '../../services/sheet-csv.service';

@Component({
  selector: 'app-daily-activities-page',
  templateUrl: './daily-activities-page.component.html',
  styleUrls: ['./daily-activities-page.component.scss']
})
export class DailyActivitiesPageComponent implements OnInit {

  sheets: Sheet[] = [];

  constructor(
    private store: SheetStoreService,
    private csv: SheetCsvService,
  ) { }

  async ngOnInit() {
    await this.store.prepareForToday();

    this.sheets = await this.store.load();

    this.store.ImportEvent.subscribe(this.importRecords.bind(this));
  }

  importRecords(records: CsvRecord[]) {
    this.csv.import(this.sheets, records);
  }
}
