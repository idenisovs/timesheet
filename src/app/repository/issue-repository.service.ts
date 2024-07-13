import { Injectable } from '@angular/core';

import { SheetStoreService } from '../services/sheet-store.service';
import { Issue } from '../dto';

@Injectable({
  providedIn: 'root'
})
export class IssueRepositoryService {
  private db = this.store.Instance;

  constructor(private store: SheetStoreService) {}

  async getAll(): Promise<Issue[]> {
    return this.db.issues.toArray();
  }

  async getByKey(issueKey: string): Promise<Issue | undefined> {
    return this.db.issues.where('key').equals(issueKey).first();
  }

  async getByActivityIds(activityIds: string[]): Promise<Issue[]> {
    return this.db.issues.where('activities').anyOf(activityIds).toArray();
  }

  async getByKeyPrefix(issueKeyPrefix: string): Promise<Issue[]> {
    return this.db.issues.where('key').startsWith(issueKeyPrefix).toArray();
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
