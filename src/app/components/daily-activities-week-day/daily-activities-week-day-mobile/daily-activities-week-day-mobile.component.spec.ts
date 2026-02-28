import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyActivitiesWeekDayMobileComponent } from './daily-activities-week-day-mobile.component';

describe('DailyActivitiesWeekDayMobileComponent', () => {
  let component: DailyActivitiesWeekDayMobileComponent;
  let fixture: ComponentFixture<DailyActivitiesWeekDayMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyActivitiesWeekDayMobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyActivitiesWeekDayMobileComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
