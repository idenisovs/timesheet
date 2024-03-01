import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Issue } from '../../../dto';
import { IssuePageService } from '../issue-page.service';
import { Router } from '@angular/router';
import { SheetStoreService } from '../../../services/sheet-store.service';

@Component({
  selector: 'app-issue-card',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './issue-card.component.html',
  styleUrl: './issue-card.component.scss'
})
export class IssueCardComponent implements OnInit {

  form = this.fb.group({
    name: ['']
  });

  @Input()
  issue!: Issue;

  constructor(
    private fb: FormBuilder,
    private issuePageService: IssuePageService,
    private router: Router,
    private sheetStore: SheetStoreService,
  ) {}

  ngOnInit() {
    this.form.get('name')?.setValue(this.issue.name);
  }

  async saveIssue() {
    if (!this.issue) {
      return;
    }

    const db = this.sheetStore.Instance;

    const issueName = this.form.controls['name'].value || '';

    await db.issues.update(this.issue, {
      name: issueName
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
    return this.router.navigate(['issues']);
  }
}
