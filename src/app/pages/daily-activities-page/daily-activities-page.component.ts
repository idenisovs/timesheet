import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { Week } from '../../dto';
import { WeeksRepositoryService } from '../../repository/weeks-repository.service';
import { Actions } from '../../services/Actions';
import { ActionsService } from '../../services/actions.service';
import { ExportWorkflowService } from '../../workflows/export-workflow.service';
import { PrepareForTodayWorkflowService } from '../../workflows/prepare-for-today-workflow.service';
import { delay } from '../../utils';
import { DailyActivitiesWeekComponent } from '../../components/daily-activities-week/daily-activities-week.component';

@Component({
	selector: 'app-daily-activities-page',
	templateUrl: './daily-activities-page.component.html',
	styleUrls: ['./daily-activities-page.component.scss'],
	standalone: true,
	imports: [InfiniteScrollDirective, DailyActivitiesWeekComponent],
})
export class DailyActivitiesPageComponent implements OnInit, AfterViewInit, OnDestroy {
	private router = inject(Router);
	private weekRepo = inject(WeeksRepositoryService);
	private actionsService = inject(ActionsService);
	private exportWorkflow = inject(ExportWorkflowService);
	private prepareForTodayWorkflow = inject(PrepareForTodayWorkflowService);
	private actionSubs = this.actionsService.on.subscribe(this.handlePageActions.bind(this));

	@ViewChild('weeksList') weekListRef!: ElementRef;

	weeks: Week[] = [];
	offset = 0;

	async ngOnInit() {
		await this.prepareForTodayWorkflow.run();
		await this.loadNextWeek();
	}

	async ngAfterViewInit() {
		await this.preloadWeeks();
	}

	ngOnDestroy() {
		this.actionSubs.unsubscribe();
	}

	async preloadWeeks() {
		await delay(150);

		const weekListHeight = (this.weekListRef.nativeElement as HTMLElement).offsetHeight;
		const windowHeight = window.innerHeight;
		const numberOfWeeks = await this.weekRepo.getCount();

		if (weekListHeight <= windowHeight && this.weeks.length < numberOfWeeks) {
			await this.loadNextWeek();
			void this.preloadWeeks();
		}
	}

	public async loadNextWeek() {
		const week = await this.weekRepo.getByOffset(this.offset);

		this.offset += 1;

		if (week) {
			this.weeks.push(week);
		}
	}

	private async handlePageActions(action: Actions) {
		switch (action) {
			case Actions.Export:
				await this.exportWorkflow.export();
				break;
			case Actions.Import:
				await this.router.navigate(['import']);
				break;
		}
	}
}
