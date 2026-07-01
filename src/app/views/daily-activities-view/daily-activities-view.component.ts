import {
	Component,
	ElementRef,
	inject,
	signal,
	ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Week } from '../../entities';
import { Actions } from '../../services/Actions';
import { ActionsService } from '../../services/actions.service';
import { ExportWorkflowService } from '../../workflows/export-workflow.service';
import { WeekComponent } from './week/week.component';
import { BottomLoadIndicatorComponent } from './bottom-load-indicator/bottom-load-indicator.component';
import { WeekHeaderMobileComponent } from './week/week-header-mobile/week-header-mobile.component';


@Component({
	selector: 'app-daily-activities-view',
	templateUrl: './daily-activities-view.component.html',
	styleUrls: ['./daily-activities-view.component.scss'],
	standalone: true,
	imports: [WeekComponent, BottomLoadIndicatorComponent, WeekHeaderMobileComponent],
})
export class DailyActivitiesViewComponent {
	private router = inject(Router);
	private actionsService = inject(ActionsService);
	private exportWorkflow = inject(ExportWorkflowService);

	private actionSubs = this.actionsService.on.subscribe(this.handlePageActions.bind(this));
	private myOwnLittleInfiniteScroll!: Subscription;

	@ViewChild('weeksList') weekListRef!: ElementRef;

	currentWeek = signal<Week>(new Week());
	weeks = signal<Week[]>([]);

	public async ngOnInit() {
		this.currentWeek.set(new Week());
		this.weeks.set([this.currentWeek()]);
	}

	public ngOnDestroy() {
		this.actionSubs.unsubscribe();
		this.myOwnLittleInfiniteScroll?.unsubscribe();
	}

	protected appendWeekList(week: Week) {
		this.weeks.update(prev => [...prev, week])
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
