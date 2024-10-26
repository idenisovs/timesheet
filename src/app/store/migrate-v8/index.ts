import { Transaction } from 'dexie';

import SheetStore from '../SheetStore';
import { Issue } from '../../dto';
import { ActivityRecord } from '../records';


export default async function migrateV8(store: SheetStore, trans: Transaction) {
	console.log('Running migration v8!');

	const activityRecords = await store.activities.toArray();

	console.log(`Retrieved ${activityRecords.length} activities!`);

	for (const activity of activityRecords) {
		const issueKey = getIssueKey(activity);

		if (!issueKey) {
			console.log(`Activity ${activity.name} has no key, skipping!`);
			continue;
		}

		const issueRecord = await store.issues.where('key').equals(issueKey).first();

		if (!issueRecord) {
			console.log(`Activity ${issueKey} has no linked issue!`);
			continue;
		}

		activity.issueId = issueRecord.id;
	}

	return trans.table('activities').bulkPut(activityRecords);
}

function getIssueKey(record: ActivityRecord): string | null {
	const match = record.name.match(Issue.KEY_PATTERN);

	if (!match) {
		return null;
	}

	const [issueKey] = match;

	return issueKey;
}


