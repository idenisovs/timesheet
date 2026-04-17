import { Component, effect, inject, input, InputSignal, signal } from '@angular/core';

import { Issue } from '../../../entities';
import { ImportIssuesService } from './import-issues.service';
import { IssueRepositoryService } from '../../../repository/issue-repository.service';
import { DiffStatus } from '../DiffStatus';

@Component({
	selector: 'app-import-issues',
	imports: [],
	templateUrl: './import-issues.component.html',
	styleUrl: './import-issues.component.scss',
})
export class ImportIssuesComponent {
	private service = inject(ImportIssuesService);
	private repo = inject(IssueRepositoryService);

	public importedIssues: InputSignal<Issue[]> = input<Issue[]>([]);

	protected createdIssues = signal<Issue[]>([]);
	protected updatedIssues = signal<Issue[]>([]);
	protected sameIssueCount = signal(0);

	get TotalLength() {
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
		for (const issue of this.createdIssues()) {
			await this.repo.create(issue);
		}

		this.createdIssues.set([]);
	}

	async saveUpdated() {
		for (const issue of this.updatedIssues()) {
			await this.repo.update(issue);
		}

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
					this.updatedIssues.update(prev => [...prev, importedIssue]);
					break;
				default:
					this.sameIssueCount.update(prev => prev + 1);
			}
		}
	}
}
