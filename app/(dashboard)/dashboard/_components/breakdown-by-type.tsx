import { CategoriesStatsByType } from '@/app/api/stats/categories/route';
import SkeletonWrapper from '@/components/skeleton-wrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TransactionType } from '@prisma/client';
import React, { useMemo } from 'react';
import CountUp from 'react-countup';

interface Props {
	type: TransactionType;
	data?: CategoriesStatsByType;
	isLoading: boolean;
	formattingFn: (n: number) => string;
}

export default function BreakdownByType({
	type,
	data,
	isLoading,
	formattingFn,
}: Props) {
	const totalAmount = useMemo(() => {
		return data?.reduce((acc, category) => acc + category.amount, 0);
	}, [data]);

	return (
		<Card className="h-[310px]">
			<CardHeader>
				<CardTitle className="text-muted-foreground text-2xl">
					{type === 'INCOME' ? 'Income' : 'Expense'} by category
				</CardTitle>
				<SkeletonWrapper isLoading={isLoading}>
					<CardContent className="px-1 py-4">
						<ScrollArea className="h-[205px]">
							{data?.map((category) => {
								const percentage = Math.round(
									(100 * category.amount) / (totalAmount || 1)
								);

								return (
									<div className="space-y-2 mb-4" key={category.id}>
										<div className="flex justify-between items-center">
											<div>
												<span className="text-muted-foreground font-bold">
													{category.name ? (
														<>
															{category.icon} {category.name}
														</>
													) : (
														<>🚫 No category</>
													)}
												</span>
												<span className="ml-2 text-sm text-muted-foreground">
													(
													{
														<CountUp
															preserveValue
															end={percentage}
															duration={1}
														/>
													}
													%)
												</span>
											</div>
											<CountUp
												preserveValue
												end={category.amount}
												duration={1}
												formattingFn={formattingFn}
												className="text-muted-foreground text-sm"
												decimals={2}
											/>
										</div>
										<Progress
											value={percentage}
											indicatorColor={
												type === 'INCOME' ? 'bg-emerald-400' : 'bg-red-400'
											}
											animate
										/>
									</div>
								);
							})}
							{!data?.length && (
								<div className="h-40 flex justify-center items-center flex-col">
									No data for the selected period
									<span className="text-muted-foreground text-sm text-center">
										Try selecting a different period or try adding new{' '}
										{type === 'INCOME' ? 'incomes' : 'expenses'}
									</span>
								</div>
							)}
						</ScrollArea>
					</CardContent>
				</SkeletonWrapper>
			</CardHeader>
		</Card>
	);
}
