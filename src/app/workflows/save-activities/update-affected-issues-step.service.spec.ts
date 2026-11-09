import { TestBed } from '@angular/core/testing';
import { UpdateAffectedIssuesStepService } from './update-affected-issues-step.service';

describe('UpdateAffectedIssuesStepService', () => {
  let service: UpdateAffectedIssuesStepService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateAffectedIssuesStepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
