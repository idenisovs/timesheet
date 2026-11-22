import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

import { NavbarComponent } from '@components/navbar/navbar.component';
import { ColorModeService } from '@services/color-mode.service';
import { ActionsService } from '@services/actions.service';
import { Actions } from '@services/Actions';
import { AppHeaderComponent } from '@components/app-header/app-header.component';
import { ToastContainerComponent } from '@components/toast-container/toast-container.component';
import { SyncService } from './sync/sync.service';
import { SettingsService } from '@services/settings.service';
import {
	SyncStatusPanelComponent
} from '@components/sync-status-panel/sync-status-panel.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [RouterOutlet, NavbarComponent, AppHeaderComponent, ToastContainerComponent, SyncStatusPanelComponent],
})
export class AppComponent implements OnInit, OnDestroy {
	private readonly actions = inject(ActionsService);
	private readonly colorMode = inject(ColorModeService);
	private readonly settings = inject(SettingsService);

	protected readonly isSyncServiceEnabled = computed(() => {
		return this.settings.settings$().isSyncServiceEnabled;
	});

	title = 'timesheet';
	actionsSubs!: Subscription;

	constructor() {
		inject(SyncService);
	}

	ngOnInit() {
		this.actionsSubs = this.actions.on.subscribe(this.handlePageActions.bind(this));
		this.colorMode.loadColorMode();
	}

	ngOnDestroy() {
		this.actionsSubs.unsubscribe();
	}

	private async handlePageActions(action: Actions) {
		switch (action) {
			case Actions.ToggleMode:
				this.colorMode.toggleMode();
				break;
		}
	}
}
