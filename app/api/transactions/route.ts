import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
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

	const result = await getTransactions(
		userId,
		parsedParams.data.from,
		parsedParams.data.to
	);
	return Response.json(result);
}

export type GetTransactionsResponseTypeRow = GetTransactionsResponseType[0];

export type GetTransactionsResponseType = Awaited<
	ReturnType<typeof getTransactions>
>;

async function getTransactions(userId: string, from: string, to: string) {
	return await prisma.transaction
		.findMany({
			where: {
				userId,
				date: { gte: from, lte: to },
			},
			include: {
				category: {
					select: {
						name: true,
						icon: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})
		.then((transactions) =>
			transactions.map((t) => ({
				...t,
				categoryName: t.category?.name || null,
				categoryIcon: t.category?.icon || null,
			}))
		);
}
