import { inject, Service } from '@angular/core';
import { Project } from '@entities';
import { Workflow } from '@workflows/Workflow';
import { SaveProjectsContext } from '@workflows/save-projects/save-projects-context';
import {
	GetProjectSnapshotsStepService,
	SaveProjectsStepService,
	SaveChangesStepService,
} from '@workflows/save-projects/steps';

@Service()
export class SaveProjectsWorkflowService {
	private readonly snapshots = inject(GetProjectSnapshotsStepService);
	private readonly save = inject(SaveProjectsStepService);
	private readonly changes = inject(SaveChangesStepService);

	private readonly workflow = new Workflow<SaveProjectsContext>([
		this.snapshots,
		this.save,
		this.changes,
	]);

	public run(projectsToSave: Project[], projectsToRemove: Project[]) {
		return this.workflow.run({
			projects: {
				toSave: projectsToSave,
				toRemove: projectsToRemove,
			},
			snapshots: [],
		});
	}
}
