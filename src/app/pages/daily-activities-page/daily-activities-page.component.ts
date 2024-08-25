import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Week } from '../../dto';
import { WeeksRepositoryService } from '../../repository/weeks-repository.service';
import { Actions } from '../../services/Actions';
import { ActionsService } from '../../services/actions.service';
import { ExportWorkflowService } from '../../workflows/export-workflow.service';
import { PrepareForTodayWorkflowService } from '../../workflows/prepare-for-today-workflow.service';

@Component({
  selector: 'app-daily-activities-page',
  templateUrl: './daily-activities-page.component.html',
  styleUrls: ['./daily-activities-page.component.scss']
})
export class DailyActivitiesPageComponent implements OnInit, OnDestroy {
  weeks: Week[] = [];

  private actionSubs = this.actionsService.on.subscribe(this.handlePageActions.bind(this));

  constructor(
    private router: Router,
    private weeksRepo: WeeksRepositoryService,
    private actionsService: ActionsService,
    private exportWorkflow: ExportWorkflowService,
    private prepareForTodayWorkflow: PrepareForTodayWorkflowService
  ) { }

  async ngOnInit() {
    await this.prepareForToday();

    this.weeks = await this.weeksRepo.getAll();
  }

  ngOnDestroy() {
    this.actionSubs.unsubscribe();
  }

  public loadPreviousWeeks() {
    console.log('Scroll Event!');
  }

  private async prepareForToday(): Promise<void> {
    return this.prepareForTodayWorkflow.run();
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
