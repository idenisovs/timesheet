import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekHeaderMobileComponent } from './week-header-mobile.component';

describe('WeekHeaderMobileComponent', () => {
  let component: WeekHeaderMobileComponent;
  let fixture: ComponentFixture<WeekHeaderMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekHeaderMobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekHeaderMobileComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
