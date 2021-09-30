import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-import-modal',
  templateUrl: './import-modal.component.html',
  styleUrls: ['./import-modal.component.scss']
})
export class ImportModalComponent implements OnInit {

  constructor(private modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  save() {
    this.modal.close();
  }

}
