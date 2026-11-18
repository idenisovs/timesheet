import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { describe, expect, it } from 'vitest';

import { SettingsService } from '@services/settings.service';
import { syncRouteGuard } from './sync-route.guard';

@Component({ selector: 'app-test-home', template: 'Home' })
class HomeComponent {}

@Component({ selector: 'app-test-sync', template: 'Sync' })
class SyncComponent {}

describe('syncRouteGuard', () => {
	it('redirects when disabled and allows navigation when enabled', async () => {
		const settings = signal({ isSyncServiceEnabled: false });
		TestBed.configureTestingModule({
			providers: [
				provideRouter([
					{ path: '', component: HomeComponent },
					{ path: 'sync', component: SyncComponent, canActivate: [syncRouteGuard] },
				]),
				{ provide: SettingsService, useValue: { settings$: settings.asReadonly() } },
			],
		});

		const harness = await RouterTestingHarness.create();
		await harness.navigateByUrl('/sync', HomeComponent);
		expect(TestBed.inject(Router).url).toBe('/');

		settings.set({ isSyncServiceEnabled: true });
		await harness.navigateByUrl('/sync', SyncComponent);
		expect(TestBed.inject(Router).url).toBe('/sync');
	});
});
