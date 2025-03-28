import prisma from '@/lib/prisma';
import { splitYMD } from '@/lib/utils';

interface Params {
	userId: string;
	income: number;
	expense: number;
	date: string;
}

export function updateMonthHistory({ userId, income, expense, date }: Params) {
	if (income === 0 && expense === 0) return null;

	let [year, month] = splitYMD(date);
	month -= 1;

	return prisma.monthHistory.upsert({
		where: {
			userId_month_year: { userId, month, year },
		},
		update: {
			income: { increment: income },
			expense: { increment: expense },
		},
		create: { userId, month, year, income, expense },
	});
}
