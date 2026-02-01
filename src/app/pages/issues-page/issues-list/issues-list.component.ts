import { Component, Input } from '@angular/core';
import { KeyValue, KeyValuePipe } from '@angular/common';
import { Issue } from '../../../dto';
import { DateIndexPipe } from './date-index.pipe';
import { IssuesTableComponent } from '../issues-table/issues-table.component';

@Component({
    selector: 'app-issues-list',
    imports: [
    KeyValuePipe,
    DateIndexPipe,
    IssuesTableComponent
],
    templateUrl: './issues-list.component.html',
    styleUrl: './issues-list.component.scss'
})
export class IssuesListComponent {
  @Input()
  issues!: Map<string, Issue[]>;

  sortByDate(a: KeyValue<string, Issue[]>, b: KeyValue<string, Issue[]>) {
    if (a.key > b.key) {
      return -1;
    }

    if (a.key < b.key) {
      return 1;
    }

    return 0;
  }
}
