import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, output } from '@angular/core';
import { Activity, Week } from '../../../entities';
import { ActivitiesService } from '../../../services/activities.service';
import { ActivitiesRepositoryService } from '../../../repository/activities-repository.service';
import { delay } from '../../../utils';
import { getPreviousWeek } from '../../../utils/date-v2';

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

	private firstActivity!: Activity;
	private currentWeek = new Week();
	private boundOnScroll = this.onScroll.bind(this);
	protected isLoading = false;

	get WeeksList() {
		return this.elementRef.nativeElement as HTMLElement;
	}

	public async ngOnInit() {
		await this.loadFirstActivity();
		await this.preloadWeeks();
	}

	public ngAfterViewInit() {
		window.addEventListener('scroll', this.boundOnScroll, { passive: true });
	}

	public async ngOnDestroy() {
		window.removeEventListener('scroll', this.boundOnScroll);
	}

	private onScroll() {
		if (this.isLoading) {
			return;
		}

		const rect = this.WeeksList.getBoundingClientRect();
		const distanceFromBottom = rect.top - window.innerHeight;

		if (distanceFromBottom < 1024) {
			void this.preloadWeeks();
		}
	}

	private async preloadWeeks() {
		await delay(50)

		if (this.isLoading) {
			return;
		}

		this.isLoading = true;
		const isEOF = this.currentWeek.start <= this.firstActivity.date;

		if (isEOF) {
			this.isLoading = false;
			return;
		}

		if (!this.isDistanceLimitReached()) {
			this.isLoading = false;
			return;
		}

		this.currentWeek = getPreviousWeek(this.currentWeek);
		this.nextWeek.emit(this.currentWeek);

		this.isLoading = false;
		void this.preloadWeeks();
	}

	private isDistanceLimitReached(): boolean {
		const rect = this.WeeksList.getBoundingClientRect();

		const distanceFromBottom = rect.top - window.innerHeight;

		return distanceFromBottom < 1024;
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
