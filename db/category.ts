import prisma from '@/lib/prisma';
import { TransactionType } from '@prisma/client';

interface CreateCategoryParams {
	userId: string;
	name: string;
	icon: string;
	type: TransactionType;
}

interface DeleteCategoryParams {
	userId: string;
	id: number;
}

interface UpdateCategoryParams {
	userId: string;
	id: number;
	name?: string;
	icon?: string;
	type?: TransactionType;
}

interface UnassignCategoryParams {
	userId: string;
	id: number;
}

export function createCategory(params: CreateCategoryParams) {
	return prisma.category.create({
		data: params,
	});
}

export function deleteCategory(params: DeleteCategoryParams) {
	return prisma.category.delete({
		where: params,
	});
}

export function updateCategory(params: UpdateCategoryParams) {
	const { userId, id, ...data } = params;

	return prisma.category.update({
		where: { userId, id },
		data,
	});
}

export function unassignCategory(params: UnassignCategoryParams) {
	const { userId, id: categoryId } = params;

	return prisma.transaction.updateMany({
		where: { userId, categoryId },
		data: { categoryId: null },
	});
}
