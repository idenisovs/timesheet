import { Table } from 'dexie';

const PAGE_SIZE = 500;

export async function* paginateTable<T>(table: Table<T>): AsyncGenerator<T[]> {
	let offset = 0;

	while (true) {
		const page: T[] = await table.offset(offset).limit(PAGE_SIZE).toArray();

		if (page.length === 0) break;

		yield page;

		offset += page.length;
	}
}
