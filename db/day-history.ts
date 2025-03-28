import prisma from '@/lib/prisma';
import { splitYMD } from '@/lib/utils';

interface Params {
	userId: string;
	income: number;
	expense: number;
	date: string;
}

export function updateDayHistory({ userId, income, expense, date }: Params) {
	if (income === 0 && expense === 0) return null;

	let [year, month, day] = splitYMD(date);
	month -= 1;

	return prisma.dayHistory.upsert({
		where: {
			userId_day_month_year: { userId, day, month, year },
		},
		update: {
			income: { increment: income },
			expense: { increment: expense },
		},
		create: { userId, day, month, year, income, expense },
	});
}
