import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Issue } from '../../../dto';
import { IssuePageService } from '../issue-page.service';
import { SheetStoreService } from '../../../services/sheet-store.service';
import { CreateIssueModalService } from '../../issues-page/create-issue-modal/create-issue-modal.service';

@Component({
    selector: 'app-issue-card',
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './issue-card.component.html',
    styleUrl: './issue-card.component.scss'
})
export class IssueCardComponent implements OnInit {

  form = this.fb.group({
    name: [''],
    estimate: ['', [this.createIssueService.durationFieldValidator()]]
  });

  @Input()
  issue!: Issue;

  constructor(
    private fb: FormBuilder,
    private issuePageService: IssuePageService,
    private createIssueService: CreateIssueModalService,
    private router: Router,
    private location: Location,
    private sheetStore: SheetStoreService,
  ) {}

  ngOnInit() {
    this.form.get('name')?.setValue(this.issue.name);
    this.form.get('estimate')?.setValue(this.issue.estimate ?? '');
  }

  async saveIssue() {
    if (!this.issue) {
      return;
    }

    const db = this.sheetStore.Instance;

    const issueName = this.form.controls['name'].value || '';
    const issueEstimate = this.form.controls['estimate'].value || '';

    await db.issues.update(this.issue, {
      name: issueName,
      estimate: this.createIssueService.normalizeDuration(issueEstimate)
    })

    await this.back();
  }

  async displayRemoveConfirmation() {
    if (this.issue) {
      if (confirm('Are you sure want to remove this issue and all related activities?')) {
        await this.issuePageService.remove(this.issue);
        await this.back();
      }
    }
  }

  async back() {
    return this.location.back();
  }
}
