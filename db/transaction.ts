import prisma from '@/lib/prisma';
import { TransactionType } from '@prisma/client';

interface CreateTransactionParams {
	userId: string;
	amount: number;
	categoryId: number | null;
	date: string;
	type: TransactionType;
	description: string | null;
}

interface DeleteTransactionParams {
	userId: string;
	id: number;
}

interface UpdateTransactionParams {
	userId: string;
	id: number;
	amount?: number;
	categoryId: number | null;
	date?: string;
	type?: TransactionType;
	description: string | null;
}

export function createTransaction(params: CreateTransactionParams) {
	return prisma.transaction.create({ data: params });
}

export function deleteTransaction(params: DeleteTransactionParams) {
	return prisma.transaction.delete({ where: params });
}

export function updateTransaction(params: UpdateTransactionParams) {
	const { userId, id, ...data } = params;
  
	return prisma.transaction.update({
		where: { userId, id },
		data,
	});
}
