import { Component, inject, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { Issue } from '@entities';
import { IssueViewService } from '../issue-view.service';
import { SaveIssuesWorkflowService } from '@workflows/save-issues/save-issues-workflow.service';
import { CreateIssueModalService } from '../../issues-view/create-issue-modal/create-issue-modal.service';

@Component({
    selector: 'app-issue-card',
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './issue-card.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './issue-card.component.scss'
})
export class IssueCardComponent implements OnInit {
	private readonly fb = inject(FormBuilder);
	private readonly issuePageService = inject(IssueViewService);
	private readonly createIssueService = inject(CreateIssueModalService);
	private readonly location = inject(Location);
	private readonly saveIssues = inject(SaveIssuesWorkflowService);

  form = this.fb.group({
    name: [''],
    estimate: ['', [this.createIssueService.durationFieldValidator()]]
  });

  @Input()
  issue!: Issue;

  ngOnInit() {
    this.form.get('name')?.setValue(this.issue.name);
    this.form.get('estimate')?.setValue(this.issue.estimate ?? '');
  }

  async saveIssue() {
    if (!this.issue) {
      return;
    }

    const issueName = this.form.controls['name'].value || '';
    const issueEstimate = this.form.controls['estimate'].value || '';

    const updatedIssue = new Issue({
      ...this.issue,
      name: issueName,
      estimate: this.createIssueService.normalizeDuration(issueEstimate)
    });

    await this.saveIssues.run([updatedIssue], []);

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
