import { Injectable } from '@angular/core';
import { ProjectPageWorkerTasks } from './ProjectPageWorkerTasks';
import { Activity, Issue, Project } from '../../dto';

@Injectable({
  providedIn: 'root'
})
export class ProjectPageService {
  private worker: Worker | null = null;

  constructor() {
    if (typeof Worker !== 'undefined') {
      this.setupWorker();
    }
  }

  getProjectIssues(project: Project) {
    this.worker?.postMessage({
      task: ProjectPageWorkerTasks.AGGREGATE_ISSUES,
      project
    });
  }

  private setupWorker() {
    this.worker = new Worker(new URL('./project-page.worker', import.meta.url));
    this.worker.onmessage = this.handleWorkerResponse.bind(this);
  }

  private handleWorkerResponse({ data }: MessageEvent<Activity[]>) {
    console.log(`page got message`);
    console.log(data);
  }
}
