import React from 'react';
import StatsCard from './stats-card';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';

interface Props {
	isLoading: boolean;
	income?: number;
	expense?: number;
	balance?: number;
	formattingFn: (n: number) => string;
}

export function StatsDisplay({
	isLoading,
	income,
	expense,
	balance,
	formattingFn,
}: Props) {
	return (
		<div className="flex flex-wrap md:flex-nowrap gap-2">
			<StatsCard
				value={income || 0}
				isLoading={isLoading}
				title="Income"
				formattingFn={formattingFn}
				icon={
					<TrendingUp className="bg-emerald-500/10 text-emerald-400 p-1.5 min-w-12 min-h-12 rounded-md" />
				}
			/>
			<StatsCard
				value={expense || 0}
				isLoading={isLoading}
				title="Expense"
				formattingFn={formattingFn}
				icon={
					<TrendingDown className="bg-red-500/10 text-red-400 p-1.5 min-w-12 min-h-12 rounded-md" />
				}
			/>
			<StatsCard
				value={balance || 0}
				isLoading={isLoading}
				difference={(income || 0) - (expense || 0)}
				title="Balance"
				formattingFn={formattingFn}
				icon={
					<Wallet className="bg-violet-500/10 text-violet-400 p-2 min-w-12 min-h-12 rounded-md" />
				}
			/>
		</div>
	);
}
