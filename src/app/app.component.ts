import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { saveAs } from 'file-saver';

import { SheetStoreService } from './services/sheet-store.service';
import { ImportModalComponent } from './components/import-modal/import-modal.component';
import CsvProcessingResult from './services/CsvProcessingResult';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'timesheet';

  constructor(
    private store: SheetStoreService,
    private modalService: NgbModal
  ) {}

  async exportToCsv() {
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

  async openImportModal() {
    try {
      const processing: CsvProcessingResult = await this.modalService.open(ImportModalComponent, {
        centered: true
      }).result;

      if (processing && processing.result) {
        this.store.import(processing.result);
      }
    } catch (dismiss) {}
  }
}
