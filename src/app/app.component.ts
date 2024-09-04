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
  actionsSubs!: Subscription;

  get IsUsingHttp(): boolean {
    return window.location.protocol === 'http:';
  }

  constructor(private actionsService: ActionsService) {}

  ngOnInit() {
    this.actionsSubs = this.actionsService.on.subscribe(this.handlePageActions.bind(this));
  }

  ngOnDestroy() {
    this.actionsSubs.unsubscribe();
  }

  private async handlePageActions(action: Actions) {
    switch (action) {
      case Actions.ToggleMode:
        this.toggleMode();
        break;
    }
  }

  private toggleMode() {
    document.documentElement.setAttribute('data-bs-theme', 'light');
  }
}
