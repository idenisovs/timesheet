import { Injectable } from '@angular/core';
import { SheetStoreService } from '../services/sheet-store.service';
import { Issue } from '../dto';

@Injectable({
  providedIn: 'root'
})
export class IssueRepositoryService {
  private db = this.store.Instance;

  constructor(private store: SheetStoreService) { }

  async getByKey(issueKey: string): Promise<Issue|undefined> {
    return this.db.issues.where('key').equals(issueKey).first();
  }

  async create(issue: Issue): Promise<Issue> {
    await this.db.issues.add(issue);
    return issue;
  }

  async update(issue: Issue): Promise<Issue> {
    await this.db.issues.put(issue);
    return issue;
  }
}
