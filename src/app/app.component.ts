import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DateTime } from 'luxon';

import { NavbarComponent } from './components/navbar/navbar.component';
import { ColorModeService } from './services/color-mode.service';
import { ActionsService } from './services/actions.service';
import { Actions } from './services/Actions';
import { version, build } from '../environments/version';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	standalone: true,
	imports: [RouterOutlet, NavbarComponent, NgbTooltip],
})
export class AppComponent implements OnInit, OnDestroy {
	private actions = inject(ActionsService);
	private colorMode = inject(ColorModeService);

	title = 'timesheet';
	actionsSubs!: Subscription;
	version = version;
	buildAgo = DateTime.fromISO(build).toRelative();

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
