import { describe, expect, it } from 'vitest';
import { Activity } from './Activity';
import { Change } from './Change';

describe('Change', () => {
	it('uses the ID from the after snapshot when entityId is missing', () => {
		const after = new Activity();
		const change = new Change({ after });

		expect(change.entityId).toBe(after.id);
	});

	it('uses the ID from the before snapshot when after is missing', () => {
		const before = new Activity();
		const change = new Change({ before });

		expect(change.entityId).toBe(before.id);
	});

	it('preserves an explicitly supplied entityId', () => {
		const after = new Activity();
		const change = new Change({ entityId: 'explicit-id', after });

		expect(change.entityId).toBe('explicit-id');
	});
});
