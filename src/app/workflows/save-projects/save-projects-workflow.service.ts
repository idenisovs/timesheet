import { inject, Service } from '@angular/core';
import { Project } from '@entities';
import { Workflow } from '@workflows/Workflow';
import { SaveProjectsContext } from '@workflows/save-projects/save-projects-context';
import { CalculateChangesStepService } from '@workflows/save-projects/steps/calculate-changes-step.service';
import { SaveChangesStepService } from '@workflows/save-projects/steps/save-changes-step.service';

@Service()
export class SaveProjectsWorkflowService {
	private readonly calculateChanges = inject(CalculateChangesStepService);
	private readonly saveChanges = inject(SaveChangesStepService);

	private readonly workflow = new Workflow<SaveProjectsContext>([
		this.calculateChanges,
		this.saveChanges,
	]);

	public run(projectsToSave: Project[], projectsToRemove: Project[]) {
		return this.workflow.run({
			projects: {
				toSave: projectsToSave,
				toRemove: projectsToRemove,
			},
			changes: [],
		});
	}
}
