import { Project } from '@entities';
import { Snapshot } from '@workflows/Snapshot';

export interface SaveProjectsContext {
	projects: {
		toSave: Project[];
		toRemove: Project[];
	};
	snapshots: Snapshot<Project>[];
}
