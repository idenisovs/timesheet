import { TestBed } from '@angular/core/testing';

import { ActivityColorControllerService } from './activity-color-controller.service';

describe('ActivityColorControllerService', () => {
  let service: ActivityColorControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityColorControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
