import { Component, Input } from '@angular/core';
import { KeyValue, KeyValuePipe, NgForOf } from '@angular/common';
import { Issue } from '../../../dto';

@Component({
  selector: 'app-issues-list',
  standalone: true,
  imports: [
    KeyValuePipe,
    NgForOf
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
