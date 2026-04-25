import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

import { NavbarComponent } from './components/navbar/navbar.component';
import { AppVersionComponent } from './components/app-version/app-version.component';
import { ColorModeService } from './services/color-mode.service';
import { ActionsService } from './services/actions.service';
import { Actions } from './services/Actions';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	standalone: true,
	imports: [RouterOutlet, NavbarComponent, AppVersionComponent],
})
export class AppComponent implements OnInit, OnDestroy {
	private actions = inject(ActionsService);
	private colorMode = inject(ColorModeService);

	title = 'timesheet';
	actionsSubs!: Subscription;

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
