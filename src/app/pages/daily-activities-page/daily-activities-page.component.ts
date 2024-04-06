import { Component, OnInit } from '@angular/core';

import { SheetStoreService } from '../../services/sheet-store.service';
import { SheetCsvService } from '../../services/sheet-csv.service';
import { CsvRecord, Sheet, Week } from '../../dto';
import { WeeksService } from '../../repository/weeks.service';

@Component({
  selector: 'app-daily-activities-page',
  templateUrl: './daily-activities-page.component.html',
  styleUrls: ['./daily-activities-page.component.scss']
})
export class DailyActivitiesPageComponent implements OnInit {
  sheets: Sheet[] = [];
  weeks: Week[] = [];

  constructor(
    private store: SheetStoreService,
    private weeksRepo: WeeksService,
    private csv: SheetCsvService,
  ) { }

  async ngOnInit() {
    await this.store.prepareForToday();

    this.weeks = await this.weeksRepo.getAll();

    console.log(this.weeks);
    //
    // this.sheets = await this.store.loadTimeSheets();
    // this.weeks = this.groupByWeek(this.sheets);
    //
    // this.store.ImportEvent.subscribe(this.importRecords.bind(this));
  }

  importRecords(records: CsvRecord[]) {
    this.csv.import(this.sheets, records);
    // this.weeks = this.groupByWeek(this.sheets);
  }
}
