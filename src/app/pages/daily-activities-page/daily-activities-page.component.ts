import { Component, OnInit } from '@angular/core';
import { SheetStoreService } from '../../services/sheet-store.service';
import { SheetCsvService } from '../../services/sheet-csv.service';
import { CsvRecord, Sheet, Week } from '../../dto';
import { getMonday } from '../../utils';

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
    private csv: SheetCsvService,
  ) { }

  async ngOnInit() {
    await this.store.prepareForToday();

    this.sheets = await this.store.load();
    this.weeks = this.groupByWeek(this.sheets);

    this.store.ImportEvent.subscribe(this.importRecords.bind(this));
  }

  importRecords(records: CsvRecord[]) {
    this.csv.import(this.sheets, records);
  }

  groupByWeek(sheets: Sheet[]): Week[] {
    const weeks: Week[] = [];
    let week = new Week();
    let currentMonday = getMonday(sheets[0].date);

    for (let currentSheet of this.sheets) {
      const monday = getMonday(currentSheet.date);

      if (currentMonday !== monday) {
        weeks.push(week);
        week = new Week();
        currentMonday = monday;
      }

      week.days.push(currentSheet);
    }

    weeks.push(week);

    return weeks;
  }
}
