import { CanActivateFn, RedirectFunction } from '@angular/router';

const SETTINGS_ROUTE_KEY = 'settingsRoute';

export const restoreSettingsRoute: RedirectFunction = () =>
	sessionStorage.getItem(SETTINGS_ROUTE_KEY) || 'general';

export const saveSettingsRoute: CanActivateFn = route => {
	const path = route.routeConfig?.path;

	if (path) {
		sessionStorage.setItem(SETTINGS_ROUTE_KEY, path);
	}

	return true;
};
