import { Component, OnInit } from '@angular/core';
import { SheetStoreService } from '../../services/sheet-store.service';
import { NgForOf } from '@angular/common';
import { Task } from '../../dto';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.scss'
})
export class TasksPageComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private sheetStore: SheetStoreService) {
  }
  ngOnInit() {
    this.sheetStore.loadTasks().then((tasks: Task[]) => {
      this.tasks = tasks;
    });
  }
}
