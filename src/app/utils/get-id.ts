export function getId(): string {
	const cryptoWithV7 = crypto as Crypto & { randomUUIDv7?: () => string };

	if (typeof cryptoWithV7.randomUUIDv7 === 'function') {
		return cryptoWithV7.randomUUIDv7();
	}

	return crypto.randomUUID();
}
