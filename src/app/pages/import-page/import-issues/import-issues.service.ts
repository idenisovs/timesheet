import { Injectable } from '@angular/core';
import { Issue } from '../../../dto';
import { IssueRepositoryService } from '../../../repository/issue-repository.service';
import { DiffStatus } from '../DiffStatus';

@Injectable({
  providedIn: 'root'
})
export class ImportIssuesService {
  constructor(
    private repository: IssueRepositoryService
  ) { }

  async getExistingIssue(importedIssue: Issue): Promise<Issue|null> {
    let existingIssue = await this.repository.getById(importedIssue.id);

    if (existingIssue) {
      return existingIssue;
    }

    return this.repository.getByKey(importedIssue.key);
  }

  getDiffStatus(existingIssue: Issue|null, importedIssue: Issue): DiffStatus {
    if (!existingIssue) {
      return DiffStatus.new;
    }

    if (!existingIssue.equals(importedIssue)) {
      return DiffStatus.updated;
    }

    return DiffStatus.same;
  }
}
