import { Transaction } from 'dexie';
import { describe, expect, it, vi } from 'vitest';
import migrateV19 from './migrate-v19';

describe('migrateV19', () => {
	it('adds entity IDs from existing change snapshots', async () => {
		const changes = [
			{ before: null, after: { id: 'created' } },
			{ before: { id: 'updated' }, after: { id: 'updated' } },
			{ before: { id: 'removed' }, after: null },
		];
		const modify = vi.fn(async (callback: (change: typeof changes[number]) => void) => {
			changes.forEach(callback);
		});
		const tx = {
			table: vi.fn().mockReturnValue({ toCollection: () => ({ modify }) }),
		} as unknown as Transaction;

		await migrateV19(tx);

		expect(tx.table).toHaveBeenCalledWith('changes');
		expect(changes).toEqual([
			{ entityId: 'created', before: null, after: { id: 'created' } },
			{ entityId: 'updated', before: { id: 'updated' }, after: { id: 'updated' } },
			{ entityId: 'removed', before: { id: 'removed' }, after: null },
		]);
	});
});
