import { Injectable } from '@angular/core';

import { Issue, Project } from '../../dto';
import { IssuesService } from '../../services/issues.service';
import { IssueRepositoryService } from '../../repository/issue-repository.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectPageService {

  constructor(
    private issueRepository: IssueRepositoryService,
    private issueService: IssuesService,
  ) {}

  async getProjectIssues(project: Project): Promise<Issue[]> {
    const result: Issue[] = []

    for (let key of project.keys) {
      const issues = await this.issueRepository.getByKeyPrefix(key);

      result.push(...issues);
    }

    result.sort(this.issueService.sort);

    return result;
  }
}
