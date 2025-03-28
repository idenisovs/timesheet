import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateIssueModalService } from './create-issue-modal.service';

@Component({
    selector: 'app-create-issue-modal',
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
    ]],
    estimate: ['', [
      this.createIssueService.durationFieldValidator()
    ]]
  });

  get NameInput() {
    return this.form.controls.name;
  }

  get EstimateInput() {
    return this.form.controls.estimate;
  }

  constructor(
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private createIssueService: CreateIssueModalService
  ) {}

  ngOnInit() {}

  async create() {
    const issueName = this.form.controls.name.value as string;
    const issueEstimate = this.form.controls.estimate.value as string;

    const issue = await this.createIssueService.save(issueName, issueEstimate);

    this.activeModal.close(issue);
  }

  cancel() {
    this.activeModal.dismiss(null);
  }
}
