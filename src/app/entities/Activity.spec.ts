import { describe, expect, it } from 'vitest';
import { Activity } from './Activity';

describe('Activity issue keys', () => {
	it('recognizes a key followed by a colon', () => {
		const activity = new Activity();
		activity.name = 'ABC-123: Work';

		expect(activity.hasIssueKey()).toBe(true);
		expect(activity.getIssueKey()).toBe('ABC-123');
	});

	it('does not recognize an activity without a colon as an issue', () => {
		const activity = new Activity();
		activity.name = 'Cat-66 is catching mouses';

		expect(activity.hasIssueKey()).toBe(false);
		expect(activity.getIssueKey()).toBeNull();
	});
});
