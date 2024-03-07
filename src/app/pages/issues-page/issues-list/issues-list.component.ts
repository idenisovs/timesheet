import { Component, Input } from '@angular/core';
import { Issue } from '../../../dto';
import { KeyValuePipe, NgForOf } from '@angular/common';

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
}
