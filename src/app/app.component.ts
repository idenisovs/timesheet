import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionsService } from './services/actions.service';
import { Subscription } from 'rxjs';
import { Actions } from './services/Actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'timesheet';
  colorMode = 'light';
  actionsSubs!: Subscription;

  get IsUsingHttp(): boolean {
    return window.location.protocol === 'http:';
  }

  constructor(private actionsService: ActionsService) {}

  ngOnInit() {
    this.actionsSubs = this.actionsService.on.subscribe(this.handlePageActions.bind(this));
    this.loadColorMode();
  }

  ngOnDestroy() {
    this.actionsSubs.unsubscribe();
  }

  private loadColorMode() {
    this.colorMode = localStorage.getItem('color-mode') ?? 'light';

    document.documentElement.setAttribute('data-bs-theme', this.colorMode);

    this.saveColorMode();
  }

  private async handlePageActions(action: Actions) {
    switch (action) {
      case Actions.ToggleMode:
        this.toggleMode();
        break;
    }
  }

  private toggleMode() {
    this.colorMode = this.colorMode === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-bs-theme', this.colorMode);

    this.saveColorMode();
  }

  private saveColorMode() {
    localStorage.setItem('color-mode', this.colorMode);
  }
}
