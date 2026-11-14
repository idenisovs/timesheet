export interface Snapshot<T> {
	before: T | null;
	after: T | null;
}
