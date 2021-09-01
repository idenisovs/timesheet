import { Component } from '@angular/core';

import { saveAs } from 'file-saver';

import { SheetStoreService } from './services/sheet-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'timesheet';

  constructor(private store: SheetStoreService) {}

  async exportCsv() {
    const sheet = await this.store.load();

    const file = [ 'date;name;from;till;duration;id' ];

    for (const dailySheet of sheet) {
      for (let activity of dailySheet.activities) {
        file.push(`${dailySheet.date};${activity.name};${activity.from};${activity.till};${activity.duration};${dailySheet.id}`);
      }
    }

    const blob = new Blob([file.join('\n')]);

    const today = new Date();

    const date = today.toISOString().split('T')[0];

    saveAs(blob, `timesheet-${date}.csv`);
  }
}
