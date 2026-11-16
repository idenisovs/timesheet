import { afterEach, describe, expect, it, vi } from 'vitest';
import { getId } from './get-id';

describe('getId', () => {
	afterEach(() => vi.unstubAllGlobals());

	it('uses randomUUIDv7 when available', () => {
		const randomUUIDv7 = vi.fn().mockReturnValue('v7-id');
		const randomUUID = vi.fn();
		vi.stubGlobal('crypto', { randomUUIDv7, randomUUID });

		expect(getId()).toBe('v7-id');
		expect(randomUUID).not.toHaveBeenCalled();
	});

	it('falls back to randomUUID when randomUUIDv7 is unavailable', () => {
		const randomUUID = vi.fn().mockReturnValue('v4-id');
		vi.stubGlobal('crypto', { randomUUID });

		expect(getId()).toBe('v4-id');
		expect(randomUUID).toHaveBeenCalledOnce();
	});
});
