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
import { DailyActivitiesWeekComponent } from '../../components/daily-activities-week/daily-activities-week.component';
import { ActivitiesRepositoryService } from '../../repository/activities-repository.service';
import { CalendarService } from '../../services/calendar.service';


@Component({
	selector: 'app-daily-activities-page',
	templateUrl: './daily-activities-page.component.html',
	styleUrls: ['./daily-activities-page.component.scss'],
	standalone: true,
	imports: [DailyActivitiesWeekComponent],
})
export class DailyActivitiesPageComponent implements OnInit, AfterViewInit, OnDestroy {
	private router = inject(Router);
	private actionsService = inject(ActionsService);
	private exportWorkflow = inject(ExportWorkflowService);
	private activitiesRepo = inject(ActivitiesRepositoryService);
	private calendarService = inject(CalendarService);

	private actionSubs = this.actionsService.on.subscribe(this.handlePageActions.bind(this));
	private myOwnLittleInfiniteScroll!: Subscription;

	@ViewChild('weeksList') weekListRef!: ElementRef;

	firstActivity: Activity = new Activity();
	currentWeek: Week = new Week();
	weeks: Week[] = [];

	async ngOnInit() {
		this.firstActivity = await this.loadFirstActivity();
		this.currentWeek = this.calendarService.getCurrentWeek();
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

	async preloadWeeks() {
		await delay(150);

		const weekListHeight = (this.weekListRef.nativeElement as HTMLElement).offsetHeight;
		const windowHeight = window.innerHeight;

		if (weekListHeight <= windowHeight && this.currentWeek.from > this.firstActivity.date) {
			await this.loadNextWeek();
			void this.preloadWeeks();
		}
	}

	private async loadFirstActivity(): Promise<Activity> {
		const existingActivity: Activity | null = await this.activitiesRepo.getFirstActivity();

		if (existingActivity) {
			return existingActivity;
		}

		return await this.activitiesRepo.create();
	}

	private attachInfiniteScroll() {
		return fromEvent(window, 'scroll', { passive: true })
			.pipe(
				debounceTime(150),
			)
			.subscribe(() => {
				const remainingPx = this.getRemainingPx();
				if (remainingPx < 400) {
					void this.loadNextWeek();
				}
			});
	}

	private async loadNextWeek() {
		this.currentWeek = this.calendarService.getPreviousWeek(this.currentWeek);
		this.weeks.push(this.currentWeek);
	}

	private getRemainingPx(): number {
		const doc = document.documentElement;
		return doc.scrollHeight - (window.scrollY + window.innerHeight);
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
