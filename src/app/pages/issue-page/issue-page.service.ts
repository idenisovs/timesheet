import { Injectable } from '@angular/core';
import { Activity, Issue, Sheet } from '../../dto';
import { SheetStoreService } from '../../services/sheet-store.service';

@Injectable({
  providedIn: 'root'
})
export class IssuePageService {

  constructor(private sheetStore: SheetStoreService) { }

  async remove(issue: Issue) {
    await this.removeActivities(issue);
    await this.removeIssue(issue);
  }

  private async removeActivities(issue: Issue) {
    const db = this.sheetStore.Instance;

    const collection = db.sheet.filter((sheet: Sheet) => {
      return sheet.activities.some((activity: Activity) => {
        return activity.name.includes(issue.key);
      })
    });

    const sheets = await collection.toArray();

    sheets.forEach((sheet: Sheet) => {
      sheet.activities = sheet.activities.filter((activity: Activity) => {
        return !activity.name.includes(issue.key);
      })
    });

    await db.sheet.bulkPut(sheets);
  }

  private async removeIssue(issue: Issue) {
    const db = this.sheetStore.Instance;
    await db.issues.delete(issue.id);
  }
}
