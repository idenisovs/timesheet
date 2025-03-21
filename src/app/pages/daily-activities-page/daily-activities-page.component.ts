import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Week } from '../../dto';
import { WeeksRepositoryService } from '../../repository/weeks-repository.service';
import { Actions } from '../../services/Actions';
import { ActionsService } from '../../services/actions.service';
import { ExportWorkflowService } from '../../workflows/export-workflow.service';
import { PrepareForTodayWorkflowService } from '../../workflows/prepare-for-today-workflow.service';
import { delay } from '../../utils';

@Component({
    selector: 'app-daily-activities-page',
    templateUrl: './daily-activities-page.component.html',
    styleUrls: ['./daily-activities-page.component.scss'],
    standalone: false
})
export class DailyActivitiesPageComponent implements OnInit, AfterViewInit, OnDestroy {
  weeks: Week[] = [];
  offset = 0;

  @ViewChild('weeksList') weekListRef!: ElementRef;

  private actionSubs = this.actionsService.on.subscribe(this.handlePageActions.bind(this));

  constructor(
    private router: Router,
    private weekRepo: WeeksRepositoryService,
    private actionsService: ActionsService,
    private exportWorkflow: ExportWorkflowService,
    private prepareForTodayWorkflow: PrepareForTodayWorkflowService
  ) { }

  async ngOnInit() {
    await this.prepareForToday();
    await this.loadNextWeek();
  }

  async ngAfterViewInit() {
    await this.preloadWeeks();
  }

  ngOnDestroy() {
    this.actionSubs.unsubscribe();
  }

  async preloadWeeks() {
    await delay(150);

    const numberOfWeeks = await this.weekRepo.getCount();
    const windowHeight = window.innerHeight;
    const weekListHeight = (this.weekListRef.nativeElement as HTMLElement).offsetHeight;

    if (weekListHeight <= windowHeight && this.weeks.length < numberOfWeeks) {
      await this.loadNextWeek();
      void this.preloadWeeks();
    }
  }

  public async loadNextWeek() {
    const week = await this.weekRepo.getByOffset(this.offset);

    this.offset += 1;

    if (week) {
      this.weeks.push(week);
    }
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
