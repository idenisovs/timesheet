import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateIssueModalService } from './create-issue-modal.service';

@Component({
  selector: 'app-create-issue-modal',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './create-issue-modal.component.html',
  styleUrl: './create-issue-modal.component.scss'
})
export class CreateIssueModalComponent implements OnInit {
  form = this.fb.group({
    name: ['', [
      Validators.required,
      this.createIssueService.issueNameFormatValidator()
    ], [
      this.createIssueService.existingIssueNameValidator()
    ]]
  });

  get NameInput() {
    return this.form.controls.name;
  }

  constructor(
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private createIssueService: CreateIssueModalService
  ) {}

  ngOnInit() {}

  async create() {
    const issue = await this.createIssueService.save(this.form.controls.name.value as string);

    this.activeModal.close(issue);
  }

  cancel() {
    this.activeModal.dismiss(null);
  }
}
