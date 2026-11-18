import { SettingsService } from '@services/settings.service';

interface SyncServiceGuardContext {
	readonly settingsService: SettingsService;
}

export function SyncServiceGuard<Args extends unknown[], Return>(
	_target: object,
	_propertyKey: string | symbol,
	descriptor: TypedPropertyDescriptor<(this: SyncServiceGuardContext, ...args: Args) => Return>,
) {
	const method = descriptor.value!;

	descriptor.value = function (this: SyncServiceGuardContext, ...args: Args): Return {
		if (!this.settingsService.settings$().isSyncServiceEnabled) {
			throw new Error('Timesheet Sync Service is disabled.');
		}

		return method.apply(this, args);
	};
}
