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
    const records = await this.db.issues.toArray();
    return records.map(Issue.fromRecord);
  }

  async getById(issueId: string): Promise<Issue | null> {
    const record = await this.db.issues.where('id').equals(issueId).first();
    return record ? Issue.fromRecord(record) : null;
  }

  async getByKey(issueKey: string): Promise<Issue | null> {
    const record = await this.db.issues.where('key').equals(issueKey).first();
    return record ? Issue.fromRecord(record) : null;
  }

  async getAllByKeys(issueKeys: string[]): Promise<Issue[]> {
    const records = await this.db.issues.where('key').anyOf(issueKeys).toArray();
    return records.map(Issue.fromRecord);
  }

  async getByActivityIds(activityIds: string[]): Promise<Issue[]> {
    const records = await this.db.issues.where('activities').anyOf(activityIds).toArray();
    return records.map(Issue.fromRecord);
  }

  async getByKeyPrefix(issueKeyPrefix: string): Promise<Issue[]> {
    const records = await this.db.issues.where('key').startsWith(issueKeyPrefix).toArray();
    return records.map(Issue.fromRecord);
  }

  async create(issue: Issue): Promise<Issue> {
    await this.db.issues.add(issue);
    return issue;
  }

  async update(issue: Issue): Promise<Issue> {
    await this.db.issues.put(issue);
    return issue;
  }

  async remove(issue: Issue): Promise<void> {
    await this.db.issues.delete(issue.id);
  }
}
