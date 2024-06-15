import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ImportModalComponent } from './components/import-modal/import-modal.component';
import { SheetCsvService } from './services/sheet-csv.service';
import { ActionsService } from './services/actions.service';
import { Actions } from './services/Actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'timesheet';

  get IsUsingHttp(): boolean {
    return window.location.protocol === 'http:';
  }

  constructor(
    private csv: SheetCsvService,
    private modalService: NgbModal,
    private actions: ActionsService
  ) {}

  ngOnInit() {
    this.actions.on.subscribe((action: Actions) => {
      switch (action) {
        case Actions.ExportToCsv:
          void this.exportToCsv();
          break;
        case Actions.ImportFromCsv:
          void this.openImportModal();
          break;
      }
    });
  }

  async exportToCsv() {
    await this.csv.export();
  }

  async openImportModal() {
    try {
      await this.modalService.open(ImportModalComponent, {
        centered: true
      }).result;

    } catch (dismiss) {}
  }
}
