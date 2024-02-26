import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SheetStoreService } from '../../services/sheet-store.service';
import { Issue } from '../../dto';

@Component({
  selector: 'app-issue-page',
  standalone: true,
  imports: [
    NgIf,
    JsonPipe,
    RouterLink,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './issue-page.component.html',
  styleUrl: './issue-page.component.scss'
})
export class IssuePageComponent implements OnInit {
  issue?: Issue;
  issueKey?: string;
  isNotFound: boolean = false;
  form = this.fb.group({
    name: ['']
  });
  db = this.sheetStore.Instance;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private sheetStore: SheetStoreService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(async ({ issueKey }) => {
      this.issueKey = issueKey;
      await this.loadIssue(issueKey);
    });
  }

  async loadIssue(issueKey: string) {
    const db = this.sheetStore.Instance;
    const existingIssue = await db.issues.where('key').equals(issueKey).first();

    if (!existingIssue) {
      this.isNotFound = true;
      return;
    }

    this.issue = existingIssue;
    this.form.get('name')?.setValue(this.issue.name);
  }

  async saveIssue() {
    if (!this.issue) {
      return;
    }

    const issueName = this.form.controls['name'].value || '';

    await this.db.issues.update(this.issue, {
      name: issueName
    })

    await this.back();
  }

  async back() {
    return this.router.navigate(['issues']);
  }
}