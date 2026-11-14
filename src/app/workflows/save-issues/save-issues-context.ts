import { Change, Issue, Project } from '@entities';

export interface SaveIssuesContext {
	issues: {
		toSave: Issue[];
		toRemove: Issue[];
	};
	changes: Change[];
}
