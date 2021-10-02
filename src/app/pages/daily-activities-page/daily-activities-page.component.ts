import { Component, OnInit } from '@angular/core';
import { SheetStoreService } from '../../services/sheet-store.service';
import { Activity, CsvRecord, Sheet } from '../../dto';

@Component({
  selector: 'app-daily-activities-page',
  templateUrl: './daily-activities-page.component.html',
  styleUrls: ['./daily-activities-page.component.scss']
})
export class DailyActivitiesPageComponent implements OnInit {

  sheets: Sheet[] = [];

  constructor(
    private store: SheetStoreService
  ) { }

  async ngOnInit() {
    await this.store.prepareForToday();

    this.sheets = await this.store.load();

    this.store.ImportEvent.subscribe(this.importRecords.bind(this));
  }

  importRecords(records: CsvRecord[]) {
    for (let record of records) {
      const dailySheet = this.sheets.find((sheet: Sheet) => sheet.date === record.date);
      const activity = this.makeActivityFromRecord(record);

      if (dailySheet) {
        this.updateSheetWithActivity(dailySheet, activity);
      } else {
        this.createSheetAndActivity(record.date, activity);
      }
    }
  }

  updateSheetWithActivity(sheet: Sheet, activity: Activity) {
    const isExistingActivity = sheet.activities.some((item) => {
      return item.name === activity.name
        && item.from === activity.from
        && item.till === activity.till
    });

    if (isExistingActivity) {
      return;
    }

    const greaterElementPosition = sheet.activities.findIndex((existingActivity) => {
      return existingActivity.till > activity.from;
    });

    if (greaterElementPosition === -1) {
      sheet.activities.push(activity);
    } else {
      sheet.activities.splice(greaterElementPosition, 0, activity);
    }

    const sheetIdx = this.sheets.findIndex((item) => item === sheet);

    this.sheets.splice(sheetIdx, 1, {...sheet});
  }

  createSheetAndActivity(date: string, activity: Activity) {
    this.sheets.push({
      date: date,
      activities: [activity]
    });
  }

  makeActivityFromRecord(record: CsvRecord): Activity {
    const { name, from, till, duration } = record;

    return {
      name,
      from,
      till,
      duration,
      isImported: true
    };
  }

}
