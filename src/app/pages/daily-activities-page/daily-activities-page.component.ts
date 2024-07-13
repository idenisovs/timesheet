import { Component, OnDestroy, OnInit } from '@angular/core';

import { SheetStoreService } from '../../services/sheet-store.service';
import { Day, Week } from '../../dto';
import { WeeksRepositoryService } from '../../repository/weeks-repository.service';
import { Actions } from '../../services/Actions';
import { ActionsService } from '../../services/actions.service';
import { ExportWorkflowService } from '../../workflows/export-workflow.service';

@Component({
  selector: 'app-daily-activities-page',
  templateUrl: './daily-activities-page.component.html',
  styleUrls: ['./daily-activities-page.component.scss']
})
export class DailyActivitiesPageComponent implements OnInit, OnDestroy {
  weeks: Week[] = [];

  private actionSubs = this.actionsService.on.subscribe(this.handlePageActions.bind(this));

  constructor(
    private store: SheetStoreService,
    private weeksRepo: WeeksRepositoryService,
    private actionsService: ActionsService,
    private exportWorkflow: ExportWorkflowService
  ) { }

  async ngOnInit() {
    await this.prepareForToday();

    this.weeks = await this.weeksRepo.getAll();
  }

  ngOnDestroy() {
    this.actionSubs.unsubscribe();
  }

  private async prepareForToday(): Promise<void> {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const db = this.store.Instance;

    let currentWeek = await db.weeks.where('till').aboveOrEqual(today).first();

    if (!currentWeek) {
      const week = new Week(today);
      currentWeek = Week.entity(week);
      await db.weeks.add(currentWeek);
    }

    const currentDay = await db.days.where('date').equals(today).first();

    if (!currentDay) {
      const day = new Day();
      day.weekId = currentWeek.id;
      await db.days.add(Day.entity(day));
    }
  }

  private handlePageActions(action: Actions) {
    switch (action) {
      case Actions.Export:
        return this.export();
    }
  }

  private export() {
    this.exportWorkflow.export();
  }
}
