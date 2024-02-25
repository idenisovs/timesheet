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
    NgIf
  ],
  templateUrl: './issues-pages.component.html',
  styleUrl: './issues-pages.component.scss'
})
export class IssuesPagesComponent implements OnInit {
  issues: Issue[] = [];

  constructor(private sheetStore: SheetStoreService) {}

  async ngOnInit() {
    this.issues = await this.sheetStore.loadIssues();
  }
}
