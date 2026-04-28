import { Transaction } from 'dexie';

import { ColorsService } from '../services/colors.service';
import { IssueRecord } from './records';

export default async function migrateV16(tx: Transaction) {
	const colorsService = new ColorsService();
	const issues = await tx.table('issues').toArray() as IssueRecord[];

	const updated = issues.map((issue) => ({
		...issue,
		color: issue.color ?? colorsService.getNextColor(),
	}));

	await tx.table('issues').bulkPut(updated);
}
