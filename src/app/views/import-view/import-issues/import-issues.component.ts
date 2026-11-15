import { Component, effect, inject, input, InputSignal, signal, ChangeDetectionStrategy } from '@angular/core';

import { Issue } from '@entities';
import { ImportIssuesService } from './import-issues.service';
import { SaveIssuesWorkflowService } from '@workflows/save-issues/save-issues-workflow.service';
import { DiffStatus } from '../DiffStatus';

@Component({
	selector: 'app-import-issues',
	imports: [],
	templateUrl: './import-issues.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './import-issues.component.scss',
})
export class ImportIssuesComponent {
	private service = inject(ImportIssuesService);
	private saveIssues = inject(SaveIssuesWorkflowService);

	public importedIssues: InputSignal<Issue[]> = input<Issue[]>([]);

	protected createdIssues = signal<Issue[]>([]);
	protected updatedIssues = signal<Issue[]>([]);
	protected sameIssueCount = signal(0);

	get TotalIssuesToImport() {
		return this.updatedIssues().length + this.createdIssues().length;
	}

	constructor() {
		effect(() => {
			void this.processImportedIssues();
		});
	}

	async saveAll() {
		await this.saveNew();
		await this.saveUpdated();
	}

	async saveNew() {
		await this.saveIssues.run(this.createdIssues(), []);

		this.createdIssues.set([]);
	}

	async saveUpdated() {
		await this.saveIssues.run(this.updatedIssues(), []);

		this.updatedIssues.set([]);
	}

	cancel() {
		this.createdIssues.set([]);
		this.updatedIssues.set([]);
	}

	private async processImportedIssues() {
		for (const importedIssue of this.importedIssues()) {
			const existingIssue = await this.service.getExistingIssue(importedIssue);
			const diffStatus = this.service.getDiffStatus(existingIssue, importedIssue);

			switch (diffStatus) {
				case DiffStatus.new:
					this.createdIssues.update(prev => [...prev, importedIssue]);
					break;
				case DiffStatus.updated:
					if (existingIssue) {
						importedIssue.id = existingIssue.id;
					}
					this.updatedIssues.update(prev => [...prev, importedIssue]);
					break;
				default:
					this.sameIssueCount.update(prev => prev + 1);
			}
		}
	}
}
