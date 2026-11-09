import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DateTime } from 'luxon';
import {
	ActivitiesRepositoryService
} from '@repository/activities-repository.service';

import {
	BottomLoadIndicatorComponent
} from './bottom-load-indicator.component';

describe('BottomLoadIndicatorComponent', () => {
	let component: BottomLoadIndicatorComponent;
	let fixture: ComponentFixture<BottomLoadIndicatorComponent>;

	beforeEach(async () => {
		vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
			matches: false,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn()
		}));
		await TestBed.configureTestingModule({
			imports: [BottomLoadIndicatorComponent],
			providers: [{
				provide: ActivitiesRepositoryService,
				useValue: {
					getFirstActivity: vi.fn().mockResolvedValue({
						date: DateTime.now()
					})
				}
			}]
		})
		.compileComponents();

		fixture = TestBed.createComponent(BottomLoadIndicatorComponent);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
