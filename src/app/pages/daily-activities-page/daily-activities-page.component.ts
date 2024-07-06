import { Component, OnInit } from '@angular/core';

import { SheetStoreService } from '../../services/sheet-store.service';
import { Day, Week } from '../../dto';
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
    await this.prepareForToday();

    this.weeks = await this.weeksRepo.getAll();
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
}
