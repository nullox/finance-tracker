'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Transaction } from '@prisma/client';
import {
	updateTransactionSchema,
	UpdateTransactionSchemaType,
} from '@/schema/transaction';
import CategoryPicker from './category-picker';
import DatePicker from './date-picker';
import { dateToYMD, YMDToDate } from '@/lib/utils';
import { useUpdateTransaction } from '@/hooks/mutation-hooks';

interface Props {
	transaction: Transaction;
	setOpen: (open: boolean) => void;
}

export function UpdateTransactionForm({ transaction, setOpen }: Props) {
	const form = useForm<UpdateTransactionSchemaType>({
		resolver: zodResolver(updateTransactionSchema),
		defaultValues: {
			id: transaction.id,
			amount: transaction.amount,
			description: transaction.description,
			type: transaction.type,
			date: transaction.date,
			categoryId: transaction.categoryId,
		},
	});

	const { mutate } = useUpdateTransaction({
		onSuccess: () => setOpen(false),
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit((data) => mutate(data))}
				className="flex flex-col gap-4 pt-2"
			>
				<FormField
					control={form.control}
					name="amount"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Amount</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="number"
									min={0}
									step={0.01}
									value={field.value ?? ''}
									className="border-border"
								/>
							</FormControl>
							<FormDescription>Transaction amount (required)</FormDescription>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Input
									{...field}
									className="border-border"
									maxLength={128}
									value={field.value ?? ''}
								/>
							</FormControl>
							<FormDescription>
								Transaction description (optional)
							</FormDescription>
						</FormItem>
					)}
				/>

				<div className="flex flex-col sm:flex-row justify-between gap-4">
					<FormField
						control={form.control}
						name="categoryId"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Category</FormLabel>
								<FormControl>
									<CategoryPicker
										categoryId={field.value}
										type={transaction.type}
										onPick={(category) => {
											form.setValue('categoryId', category?.id || null, {
												shouldValidate: true,
											});
										}}
									/>
								</FormControl>
								<FormDescription>Category for transaction</FormDescription>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="date"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Date</FormLabel>
								<FormControl>
									<DatePicker
										currentDate={YMDToDate(field.value?.toString() || '')}
										onPick={(date: Date) => {
											form.setValue('date', dateToYMD(date), {
												shouldValidate: true,
											});
										}}
									/>
								</FormControl>
								<FormDescription>Date for transaction</FormDescription>
							</FormItem>
						)}
					/>
				</div>

				<div className="flex justify-end gap-2">
					<Button
						variant="secondary"
						type="button"
						onClick={() => setOpen(false)}
					>
						Cancel
					</Button>
					<Button type="submit">Save</Button>
				</div>
			</form>
		</Form>
	);
}
