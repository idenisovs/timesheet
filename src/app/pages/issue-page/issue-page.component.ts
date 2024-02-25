import { Component, OnInit } from '@angular/core';
import { SheetStoreService } from '../../services/sheet-store.service';
import { Issue } from '../../dto';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JsonPipe, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-issue-page',
  standalone: true,
  imports: [
    NgIf,
    JsonPipe,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './issue-page.component.html',
  styleUrl: './issue-page.component.scss'
})
export class IssuePageComponent implements OnInit {
  issue?: Issue;
  issueKey?: string;
  isNotFound = false;
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
      const db = this.sheetStore.Instance;

      const existingIssue = await db.issues.where('key').equals(issueKey).first();

      this.issueKey = issueKey;

      if (existingIssue) {
        this.issue = existingIssue;
        this.form.get('name')?.setValue(this.issue.name);
      } else {
        this.isNotFound = true;
      }
    });
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
