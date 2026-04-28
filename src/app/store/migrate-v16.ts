import Dexie, { Transaction } from 'dexie';

import { ColorsService } from '../services/colors.service';
import { ActivityRecord, IssueRecord } from './records';
import { activityChunks } from './activity-chunks';

export default async function migrateV16(tx: Transaction) {
	const colorsService = new ColorsService();
	const issues = await tx.table('issues').toArray() as IssueRecord[];

	for (let issue of issues) {
		issue.color = colorsService.getNextColor();
	}

	await tx.table('issues').bulkPut(issues);

	const activityTable = tx.table('activities') as Dexie.Table<ActivityRecord, string>;

	for await (const chunk of activityChunks(activityTable)) {
		chunk.forEach((record: ActivityRecord) => {
			const issue = issues.find(issue => issue.id === record.issueId);

			if (issue) {
				record.color = issue.color;
			} else {
				record.color = colorsService.getNextColor();
			}
		});

		await activityTable.bulkPut(chunk);
	}
}
