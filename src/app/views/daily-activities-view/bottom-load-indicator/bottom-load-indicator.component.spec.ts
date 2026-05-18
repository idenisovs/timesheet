import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomLoadIndicatorComponent } from './bottom-load-indicator.component';

describe('BottomLoadIndicatorComponent', () => {
  let component: BottomLoadIndicatorComponent;
  let fixture: ComponentFixture<BottomLoadIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomLoadIndicatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BottomLoadIndicatorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
