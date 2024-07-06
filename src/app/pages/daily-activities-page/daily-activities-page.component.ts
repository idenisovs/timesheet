import { Component, OnInit } from '@angular/core';

import { SheetStoreService } from '../../services/sheet-store.service';
import { SheetCsvService } from '../../services/sheet-csv.service';
import {Activity, CsvRecord, Sheet, Week} from '../../dto';
import { getMonday } from '../../utils';

@Component({
  selector: 'app-daily-activities-page',
  templateUrl: './daily-activities-page.component.html',
  styleUrls: ['./daily-activities-page.component.scss']
})
export class DailyActivitiesPageComponent implements OnInit {
  sheets: Sheet[] = [];
  weeks: Week[] = [];
  isImportMessageShown = false;

  constructor(
    private store: SheetStoreService,
    private csv: SheetCsvService,
  ) { }

  async ngOnInit() {
    await this.store.prepareForToday();

    this.sheets = await this.store.loadTimeSheets();
    this.weeks = this.groupByWeek(this.sheets);

    this.store.ImportEvent.subscribe(this.importRecords.bind(this));
  }

  importRecords(records: CsvRecord[]) {
    this.csv.import(this.sheets, records);
    this.weeks = this.groupByWeek(this.sheets);
    this.isImportMessageShown = true;
  }

  groupByWeek(sheets: Sheet[]): Week[] {
    const weeks: Week[] = [];
    let week = new Week(sheets[0].date);

    for (let currentSheet of this.sheets) {
      const currentMonday = getMonday(currentSheet.date);

      if (week.monday.toDateString() !== currentMonday.toDateString()) {
        weeks.push(week);
        week = new Week(currentSheet.date);
      }

      week.days.push(currentSheet);
    }

    weeks.push(week);

    return weeks;
  }

  async saveImportedActivities() {
    for (const sheet of this.sheets) {
      sheet.activities.forEach((activity: Activity) => {
        activity.isImported = false;
      });

      await this.store.save(sheet);
    }

    this.isImportMessageShown = false;
  }

  hideImportMessage() {
    this.isImportMessageShown = false;
  }
}
