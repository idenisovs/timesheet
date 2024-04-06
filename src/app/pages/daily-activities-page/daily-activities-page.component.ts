import { Component, OnInit } from '@angular/core';

import { SheetStoreService } from '../../services/sheet-store.service';
import { SheetCsvService } from '../../services/sheet-csv.service';
import { CsvRecord, Sheet, Week } from '../../dto';
import { WeeksRepositoryService } from '../../repository/weeks-repository.service';
import { DaysRepositoryService } from '../../repository/days-repository.service';
import { ActivitiesRepositoryService } from '../../repository/activities-repository.service';

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
    private weeksRepo: WeeksRepositoryService,
    private daysRepo: DaysRepositoryService,
    private activitiesRepo: ActivitiesRepositoryService,
    private csv: SheetCsvService,
  ) { }

  async ngOnInit() {
    await this.store.prepareForToday();

    this.weeks = await this.weeksRepo.getAll();

    console.log('++++++++++');
    console.log(this.weeks);
    console.log('++++++++++');
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
