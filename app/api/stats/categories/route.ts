import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { TransactionType } from '@prisma/client';
import { DateRangeSchema } from '@/schema/stats';

export async function GET(request: Request) {
	const session = await auth();
	if (!session?.user?.email) {
		redirect('/');
	}
	const userId = session.user.email;

	const { searchParams } = new URL(request.url);
	const from = searchParams.get('from');
	const to = searchParams.get('to');

	const parsedParams = DateRangeSchema.safeParse({ from, to });
	if (!parsedParams.success) {
		return Response.json(parsedParams.error.message, { status: 400 });
	}

	const result = await getCategoriesStats(
		userId,
		parsedParams.data.from,
		parsedParams.data.to
	);
	return Response.json(result);
}

async function getCategoriesStatsByType(
	userId: string,
	from: string,
	to: string,
	type: TransactionType
) {
	const stats = await prisma.transaction.groupBy({
		by: ['categoryId'],
		where: {
			userId,
			type,
			date: {
				gte: from,
				lte: to,
			},
		},
		_sum: {
			amount: true,
		},
		orderBy: {
			_sum: {
				amount: 'desc',
			},
		},
	});

	const categoryIds = stats
		.filter((stat) => stat.categoryId !== null)
		.map((stat) => stat.categoryId) as number[];

	const categories = await prisma.category.findMany({
		where: {
			id: {
				in: categoryIds,
			},
		},
		select: {
			id: true,
			name: true,
			icon: true,
		},
	});

	const categoryMap = new Map(
		categories.map((cat) => [cat.id, { name: cat.name, icon: cat.icon }])
	);

	return stats.map((stat) => ({
		id: stat.categoryId?.toString() || '',
		name: stat.categoryId
			? categoryMap.get(stat.categoryId)?.name || null
			: null,
		icon: stat.categoryId
			? categoryMap.get(stat.categoryId)?.icon || null
			: null,
		amount: stat._sum.amount || 0,
	}));
}

async function getCategoriesStats(userId: string, from: string, to: string) {
	const incomeStats = await getCategoriesStatsByType(
		userId,
		from,
		to,
		'INCOME'
	);
	const expenseStats = await getCategoriesStatsByType(
		userId,
		from,
		to,
		'EXPENSE'
	);

	return {
		income: incomeStats,
		expense: expenseStats,
	};
}

export type CategoriesStatsByType = Awaited<
	ReturnType<typeof getCategoriesStatsByType>
>;

export type GetCategoriesStatsResponseType = {
	income: CategoriesStatsByType;
	expense: CategoriesStatsByType;
};
