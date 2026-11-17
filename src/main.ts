// src/main.ts
import { enableProdMode, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { routes } from './app/app.routes';
import { SettingsService } from '@services/settings.service';

if (environment.production) {
	enableProdMode();
}

bootstrapApplication(AppComponent, {
	providers: [
		provideZoneChangeDetection(),
		provideRouter(routes),
		provideHttpClient(),
		provideAppInitializer(() => {
			const settingsService = inject(SettingsService);
			return settingsService.load();
		})
	],
}).catch((err) => console.error(err));
