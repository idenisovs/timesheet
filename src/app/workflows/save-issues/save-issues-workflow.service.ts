import { inject, Service } from '@angular/core';
import { Workflow } from '@workflows/Workflow';
import { Issue } from '@entities';
import { GetIssueSnapshotsStepService } from '@workflows/save-issues/steps/get-issue-snapshots-step.service';
import { SaveChangesStepService } from '@workflows/save-issues/steps/save-changes-step.service';
import { UpdateAffectedProjectsStepService } from '@workflows/save-issues/steps/update-affected-projects-step.service';
import {
	SaveIssuesContext
} from '@workflows/save-issues/save-issues-context';
import {
	SaveIssuesStepService
} from '@workflows/save-issues/steps/save-issues-step.service';

@Service()
export class SaveIssuesWorkflowService {
	private readonly snapshots = inject(GetIssueSnapshotsStepService);
	private readonly save = inject(SaveIssuesStepService);
	private readonly changes = inject(SaveChangesStepService);
	private readonly projects = inject(UpdateAffectedProjectsStepService);

	private readonly workflow = new Workflow<SaveIssuesContext>([
		this.snapshots,
		this.save,
		this.changes,
		this.projects,
	]);

	public run(issuesToSave: Issue[], issuesToRemove: Issue[]) {
		return this.workflow.run({
			issues: {
				toSave: issuesToSave,
				toRemove: issuesToRemove
			},
			snapshots: [],
		});
	}
}
