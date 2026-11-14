import { inject, Service } from '@angular/core';
import { Workflow } from '@workflows/Workflow';
import { Issue } from '@entities';
import { CalculateChangesStepService } from '@workflows/save-issues/steps/calculate-changes-step.service';
import { SaveChangesStepService } from '@workflows/save-issues/steps/save-changes-step.service';
import { UpdateAffectedProjectsStepService } from '@workflows/save-issues/steps/update-affected-projects-step.service';
import {
	SaveIssuesContext
} from '@workflows/save-issues/save-issues-context';

@Service()
export class SaveIssuesWorkflowService {
	private readonly calculateChanges = inject(CalculateChangesStepService);
	private readonly saveChanges = inject(SaveChangesStepService);
	private readonly updateProjects = inject(UpdateAffectedProjectsStepService);

	private readonly workflow = new Workflow<SaveIssuesContext>([
		this.calculateChanges,
		this.saveChanges,
		this.updateProjects,
	]);

	public run(issuesToSave: Issue[], issuesToRemove: Issue[]) {
		return this.workflow.run({
			issues: {
				toSave: issuesToSave,
				toRemove: issuesToRemove
			},
			changes: [],
			affectedProjects: [],
		})
	}
}
