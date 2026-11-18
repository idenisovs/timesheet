import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { SettingsService } from '@services/settings.service';

export const syncRouteGuard: CanActivateFn = () => {
	const settings = inject(SettingsService).settings$();

	if (settings.isSyncServiceEnabled) {
		return true;
	}

	return inject(Router).parseUrl('/');
};
