import { TestBed } from '@angular/core/testing';
import { UpdateAffectedProjectsStepService } from './update-affected-projects-step.service';

describe('UpdateAffectedProjectsService', () => {
  let service: UpdateAffectedProjectsStepService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateAffectedProjectsStepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
