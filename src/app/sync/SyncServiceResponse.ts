export interface SavedChange {
	changeId: string;
	entityId: string;
}

export interface FailedChange extends SavedChange {
	reason: string;
}

export interface SyncServiceResponse {
	saved: SavedChange[];
	skipped: FailedChange[];
	failed: FailedChange[];
}
