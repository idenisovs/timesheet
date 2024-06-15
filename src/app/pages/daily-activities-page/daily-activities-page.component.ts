import { Component, OnInit } from '@angular/core';

import { SheetStoreService } from '../../services/sheet-store.service';
import { Week } from '../../dto';
import { WeeksRepositoryService } from '../../repository/weeks-repository.service';

@Component({
  selector: 'app-daily-activities-page',
  templateUrl: './daily-activities-page.component.html',
  styleUrls: ['./daily-activities-page.component.scss']
})
export class DailyActivitiesPageComponent implements OnInit {
  weeks: Week[] = [];

  constructor(
    private store: SheetStoreService,
    private weeksRepo: WeeksRepositoryService,
  ) { }

  async ngOnInit() {
    await this.store.prepareForToday();

    this.weeks = await this.weeksRepo.getAll();
  }
}
