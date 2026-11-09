import { TestBed } from '@angular/core/testing';

import { DailyActivityItemService } from './daily-activity-item.service';
import {
	ActivityColorControllerService,
} from './activity-color-controller.service';
import { beforeEach, describe, expect, it } from 'vitest';

describe('ActivityColorControllerService', () => {
	let service: ActivityColorControllerService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				ActivityColorControllerService,
				{provide: DailyActivityItemService, useValue: {}},
			],
		});
		service = TestBed.inject(ActivityColorControllerService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
