import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { SaveIssuesWorkflowService } from './save-issues-workflow.service';

describe('SaveIssuesWorkflowService', () => {
  let service: SaveIssuesWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveIssuesWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
