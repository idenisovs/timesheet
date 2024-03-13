import { Injectable } from '@angular/core';
import { Issue, Project } from '../../dto';
import { IssuesService } from '../../services/issues.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectPageService {

  constructor(private issues: IssuesService) {}

  async getProjectIssues(project: Project): Promise<Issue[]> {
    const result: Issue[] = []

    for (let key of project.keys) {
      const issues = await this.issues.getByKey(key);

      result.push(...issues);
    }

    result.sort(this.issues.sort);

    return result;
  }
}
