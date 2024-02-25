import { Component, OnInit } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { SheetStoreService } from '../../services/sheet-store.service';
import { Task } from '../../dto';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    NgIf
  ],
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.scss'
})
export class TasksPageComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private sheetStore: SheetStoreService) {
  }
  async ngOnInit() {
    this.tasks = await this.sheetStore.loadTasks();
  }
}
