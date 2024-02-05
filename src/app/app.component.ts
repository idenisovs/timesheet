import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SheetStoreService } from './services/sheet-store.service';
import { ImportModalComponent } from './components/import-modal/import-modal.component';
import CsvProcessingResult from './services/CsvProcessingResult';
import { SheetCsvService } from './services/sheet-csv.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'timesheet';

  get IsUsingHttp(): boolean {
    console.log(window.location.protocol);
    return window.location.protocol === 'http:';
  }

  constructor(
    private store: SheetStoreService,
    private csv: SheetCsvService,
    private modalService: NgbModal
  ) {}

  async exportToCsv() {
    await this.csv.export();
  }

  async openImportModal() {
    try {
      const processing: CsvProcessingResult = await this.modalService.open(ImportModalComponent, {
        centered: true
      }).result;

      if (processing && processing.result) {
        this.store.fireImportEvent(processing.result);
      }
    } catch (dismiss) {}
  }
}
