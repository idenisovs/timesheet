import {
	AfterViewInit,
	Component,
	ElementRef,
	inject,
	OnDestroy,
	OnInit,
	ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Activity, Week } from '../../entities';
import { Actions } from '../../services/Actions';
import { ActionsService } from '../../services/actions.service';
import { ExportWorkflowService } from '../../workflows/export-workflow.service';
import { delay } from '../../utils';
import { getPreviousWeek } from '../../utils/date-v2';
import { DailyActivitiesWeekComponent } from '../../components/daily-activities-week/daily-activities-week.component';
import { ActivitiesRepositoryService } from '../../repository/activities-repository.service';
import { ActivitiesService } from '../../services/activities.service';


@Component({
	selector: 'app-daily-activities-view',
	templateUrl: './daily-activities-view.component.html',
	styleUrls: ['./daily-activities-view.component.scss'],
	standalone: true,
	imports: [DailyActivitiesWeekComponent],
})
export class DailyActivitiesViewComponent implements OnInit, AfterViewInit, OnDestroy {
	private router = inject(Router);
	private actionsService = inject(ActionsService);
	private exportWorkflow = inject(ExportWorkflowService);
	private activitiesRepo = inject(ActivitiesRepositoryService);
	private activitiesService = inject(ActivitiesService);

	private actionSubs = this.actionsService.on.subscribe(this.handlePageActions.bind(this));
	private myOwnLittleInfiniteScroll!: Subscription;

	@ViewChild('weeksList') weekListRef!: ElementRef;

	firstActivity: Activity = new Activity();
	currentWeek: Week = new Week();
	weeks: Week[] = [];
	nextWeekListHeight: number = window.innerHeight;

	async ngOnInit() {
		this.firstActivity = await this.loadFirstActivity();
		this.currentWeek = new Week();
		this.weeks.push(this.currentWeek);
		this.myOwnLittleInfiniteScroll = this.attachInfiniteScroll();
	}

	async ngAfterViewInit() {
		await this.preloadWeeks();
	}

	ngOnDestroy() {
		this.actionSubs.unsubscribe();
		this.myOwnLittleInfiniteScroll.unsubscribe();
	}

	private async loadFirstActivity(): Promise<Activity> {
		const existingActivity: Activity | null = await this.activitiesRepo.getFirstActivity();

		if (existingActivity) {
			return existingActivity;
		}

		const activity = this.activitiesService.createActivity();
		await this.activitiesRepo.save([activity]);
		return activity;
	}

	private attachInfiniteScroll() {
		return fromEvent(window, 'scroll', { passive: true })
			.pipe(
				debounceTime(50),
			)
			.subscribe(() => {
				if (this.getRemainingPx() < 600) {
					this.nextWeekListHeight = this.getNextWeekListHeight();
					void this.preloadWeeks();
				}
			});
	}

	private async preloadWeeks() {
		await delay(50);

		const weekListHeight = this.getCurrentWeekListHeight();

		if (weekListHeight <= this.nextWeekListHeight && this.currentWeek.start > this.firstActivity.date) {
			this.currentWeek = getPreviousWeek(this.currentWeek);
			this.weeks.push(this.currentWeek);
			void this.preloadWeeks();
		}
	}

	private getRemainingPx(): number {
		const doc = document.documentElement;
		return doc.scrollHeight - (window.scrollY + window.innerHeight);
	}

	private getNextWeekListHeight(): number {
		return this.getCurrentWeekListHeight() * 1.30;
	}

	private getCurrentWeekListHeight(): number {
		return (this.weekListRef.nativeElement as HTMLElement).offsetHeight;
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
