import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionsService } from './services/actions.service';
import { Subscription } from 'rxjs';

import { Actions } from './services/Actions';
import { ColorModeService } from './services/color-mode.service';
import { version } from '../environments/version';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
	imports: [RouterOutlet, NavbarComponent],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'timesheet';
  actionsSubs!: Subscription;
  version = version;

  get IsUsingHttp(): boolean {
    return window.location.protocol === 'http:';
  }

  constructor(
    private actions: ActionsService,
    private colorMode: ColorModeService
  ) {}

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
