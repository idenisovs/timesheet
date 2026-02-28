import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyActivitiesWeekDayDesktopComponent } from './daily-activities-week-day-desktop.component';

describe('DailyActivitiesWeekDayDesktopComponent', () => {
  let component: DailyActivitiesWeekDayDesktopComponent;
  let fixture: ComponentFixture<DailyActivitiesWeekDayDesktopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyActivitiesWeekDayDesktopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyActivitiesWeekDayDesktopComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
