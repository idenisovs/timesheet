import { inject, Injectable } from '@angular/core';
import { Issue } from '../../../entities';
import { IssueRepositoryService } from '../../../repository/issue-repository.service';
import { DiffStatus } from '../DiffStatus';

@Injectable({
	providedIn: 'root',
})
export class ImportIssuesService {
	private repo = inject(IssueRepositoryService);

	async getExistingIssue(importedIssue: Issue): Promise<Issue | null> {
		let existingIssue = await this.repo.getById(importedIssue.id);

		if (existingIssue) {
			return existingIssue;
		}

		return this.repo.getByKey(importedIssue.key);
	}

	getDiffStatus(existingIssue: Issue | null, importedIssue: Issue): DiffStatus {
		if (!existingIssue) {
			return DiffStatus.new;
		}

		if (!existingIssue.equals(importedIssue)) {
			return DiffStatus.updated;
		}

		return DiffStatus.same;
	}
}
