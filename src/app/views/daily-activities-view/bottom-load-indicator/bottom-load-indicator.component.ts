import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, output } from '@angular/core';
import { Activity, Week } from '../../../entities';
import { ActivitiesService } from '../../../services/activities.service';
import { ActivitiesRepositoryService } from '../../../repository/activities-repository.service';
import { delay } from '../../../utils';
import { getPreviousWeek } from '../../../utils/date-v2';

const MOBILE_BREAKPOINT = '(max-width: 767.98px)';

@Component({
	selector: 'app-bottom-load-indicator',
	imports: [],
	templateUrl: './bottom-load-indicator.component.html',
	styleUrl: './bottom-load-indicator.component.scss',
})
export class BottomLoadIndicatorComponent implements OnInit, AfterViewInit, OnDestroy {
	private elementRef = inject(ElementRef);
	private activitiesRepo = inject(ActivitiesRepositoryService);
	private activitiesService = inject(ActivitiesService);

	public nextWeek = output<Week>();

	protected isLoading = true;

	private firstActivity!: Activity;
	private currentWeek = new Week();
	private boundOnScroll = this.onScroll.bind(this);
	private boundOnMediaChange = this.onMediaChange.bind(this);
	private mediaQuery = window.matchMedia(MOBILE_BREAKPOINT);
	private scrollTarget: Window | HTMLElement = window;
	private isBottomReached = true;

	private get WeeksList() {
		return this.elementRef.nativeElement as HTMLElement;
	}

	private get ParentElement() {
		const parentIsScrollContainer = this.mediaQuery.matches;

		if (parentIsScrollContainer) {
			return this.elementRef.nativeElement.parentElement as HTMLElement;
		} else {
			return window;
		}
	}

	public async ngOnInit() {
		await this.loadFirstActivity();
		await this.preloadWeeks();
	}

	public ngAfterViewInit() {
		this.mediaQuery.addEventListener('change', this.boundOnMediaChange);
		this.updateScrollTarget();
	}

	public async ngOnDestroy() {
		this.scrollTarget.removeEventListener('scroll', this.boundOnScroll);
		this.mediaQuery.removeEventListener('change', this.boundOnMediaChange);
	}

	private onMediaChange() {
		this.updateScrollTarget();
	}

	private updateScrollTarget() {
		this.scrollTarget.removeEventListener('scroll', this.boundOnScroll);
		this.scrollTarget = this.ParentElement;
		this.scrollTarget.addEventListener('scroll', this.boundOnScroll, { passive: true });
	}

	private onScroll() {
		this.checkDistanceFromBottom();

		if (!this.isLoading) {
			void this.preloadWeeks();
		}
	}

	private async preloadWeeks() {
		this.isLoading = true;

		const isEOF = this.currentWeek.start <= this.firstActivity.date;

		if (isEOF) {
			this.isLoading = false;
			return;
		}

		this.checkDistanceFromBottom();

		if (!this.isBottomReached) {
			this.isLoading = false;
			return;
		}

		this.currentWeek = getPreviousWeek(this.currentWeek);
		this.nextWeek.emit(this.currentWeek);

		await delay(50)

		void this.preloadWeeks();
	}

	private checkDistanceFromBottom() {
		const rect = this.WeeksList.getBoundingClientRect();

		if (this.scrollTarget instanceof HTMLElement) {
			const parentRect = this.scrollTarget.getBoundingClientRect();
			this.isBottomReached = rect.top - parentRect.bottom < 1024;
		} else {
			this.isBottomReached = rect.top - window.innerHeight < 1024;
		}
	}

	private async loadFirstActivity(): Promise<void> {
		const existingActivity: Activity | null = await this.activitiesRepo.getFirstActivity();

		if (existingActivity) {
			this.firstActivity = existingActivity;
			return;
		}

		const activity = this.activitiesService.createActivity();
		await this.activitiesRepo.save([activity]);
		this.firstActivity = activity;
	}
}
