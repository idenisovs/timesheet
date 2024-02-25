import { RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { Issue } from '../../dto';
import { SheetStoreService } from '../../services/sheet-store.service';

@Component({
  selector: 'app-issues-pages',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './issues-page.component.html',
  styleUrl: './issues-page.component.scss'
})
export class IssuesPageComponent implements OnInit {
  issues: Issue[] = [];

  constructor(private sheetStore: SheetStoreService) {}

  async ngOnInit() {
    this.issues = await this.sheetStore.loadIssues();
  }
}
