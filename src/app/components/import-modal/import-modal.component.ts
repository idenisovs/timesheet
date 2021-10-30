import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SheetCsvService } from '../../services/sheet-csv.service';
import CsvProcessingResult from '../../services/CsvProcessingResult';

@Component({
  selector: 'app-import-modal',
  templateUrl: './import-modal.component.html',
  styleUrls: ['./import-modal.component.scss']
})
export class ImportModalComponent implements OnInit {
  public filename?: string;
  public processingResult?: CsvProcessingResult;
  public errorMessage?: string;

  constructor(
    private modal: NgbActiveModal,
    private csv: SheetCsvService
  ) { }

  ngOnInit(): void {}

  async dropHandler(event: DragEvent) {
    event.preventDefault();

    if (!event.dataTransfer || !event.dataTransfer.files || !event.dataTransfer.files.length) {
      return;
    }

    try {
      const file = event.dataTransfer.files[0];

      this.csv.validateFile(file);

      this.filename = file.name;

      const text = await file.text();

      this.processingResult = this.csv.process(text);

      delete this.errorMessage;
    } catch (e) {
      delete this.processingResult;
      this.errorMessage = e.message;
      return
    }
  }

  dragOverHandler(event: Event) {
    event.preventDefault();
  }

  import() {
    this.modal.close(this.processingResult);
  }

  cancel() {
    this.modal.close();
  }
}
