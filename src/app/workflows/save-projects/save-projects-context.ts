import { Change, Project } from '@entities';

export interface SaveProjectsContext {
	projects: {
		toSave: Project[];
		toRemove: Project[];
	};
	changes: Change[];
}
