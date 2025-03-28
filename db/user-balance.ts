import prisma from '@/lib/prisma';
import { currencies, FALLBACK_CURRENCY } from '@/lib/currencies';

interface Params {
	userId: string;
	balanceDelta: number;
}

export function updateUserBalance({ userId, balanceDelta }: Params) {
	if (balanceDelta === 0) return null;

	return prisma.settings.upsert({
		where: { userId },
		update: {
			balance: { increment: balanceDelta },
		},
		create: {
			userId,
			balance: balanceDelta,
			currency: FALLBACK_CURRENCY.value,
		},
	});
}
