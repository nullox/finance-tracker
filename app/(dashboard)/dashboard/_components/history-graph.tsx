import { GetMonthHistoryResponseType } from '@/app/api/history/month/route';
import { GetYearDataResponseType } from '@/app/api/history/year/route';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Timeframe } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ScrollAreaScrollbar } from '@radix-ui/react-scroll-area';
import React, { ReactNode, useCallback } from 'react';
import CountUp from 'react-countup';
import {
	BarChart,
	ResponsiveContainer,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Bar,
} from 'recharts';

interface Props {
	yearData: GetYearDataResponseType;
	monthData: GetMonthHistoryResponseType;
	timeframe: Timeframe;
	formattingFn: (n: number) => void;
}

export default function HistoryGraph({
	yearData,
	monthData,
	timeframe,
	formattingFn,
}: Props) {
	const data = timeframe === 'month' ? monthData : yearData;

	if (!data?.length) {
		return (
			<div className="flex justify-center items-center flex-col min-h-56">
				<div>No data for the selected period</div>
				<div className="text-muted-foreground text-sm text-center">
					Try selecting a different period or try adding new transactions
				</div>
			</div>
		);
	}

	return (
		<ScrollAreaForGraph>
			<ResponsiveContainer className="min-h-56" minWidth={768}>
				<BarChart
					data={data}
					width={1000}
					margin={{
						top: 5,
						right: 30,
					}}
				>
					<defs>
						<linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
							<stop offset="50%" stopColor="#00bc7d" />
							<stop offset="100%" stopColor="var(--background)" />
						</linearGradient>
						<linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
							<stop offset="50%" stopColor="#fb2c36" />
							<stop offset="100%" stopColor="var(--background)" />
						</linearGradient>
					</defs>
					<CartesianGrid
						strokeDasharray="5 5"
						strokeOpacity={0.3}
						vertical={false}
					/>
					<XAxis
						dataKey={timeframe === 'month' ? 'day' : 'month'}
						strokeWidth={0}
						tickFormatter={(value: number) => {
							if (timeframe === 'month') {
								if (value % 2 === 0) return '';
								return `${value < 10 ? '0' : ''}${value}`;
							}
							return new Date(1970, value).toLocaleString('default', {
								month: 'short',
							});
						}}
					/>
					<Tooltip
						content={<CustomTooltip formattingFn={formattingFn} />}
						cursor={{ fillOpacity: 0.1 }}
					/>
					<Bar dataKey="income" fill="url(#incomeGradient)" />
					<Bar dataKey="expense" fill="url(#expenseGradient)" />
					<YAxis strokeWidth={0} />
				</BarChart>
			</ResponsiveContainer>
		</ScrollAreaForGraph>
	);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, formattingFn }: any) {
	if (!active || !payload || !payload.length) return;

	return (
		<div className="bg-background/50 backdrop-blur-sm w-fit sm:min-w-[220px] p-2 rounded-md border dark:border-none">
			<TooltipRow
				name="Income"
				circleColor="bg-emerald-400"
				textColor="text-emerald-400"
				value={payload[0].value}
				formattingFn={formattingFn}
			/>
			<TooltipRow
				name="Expense"
				circleColor="bg-red-400"
				textColor="text-red-400"
				value={payload[1].value}
				formattingFn={formattingFn}
			/>
			<TooltipRow
				name="Balance"
				circleColor="bg-foreground"
				textColor="text-foreground"
				value={payload[0].value - payload[1].value}
				formattingFn={formattingFn}
			/>
		</div>
	);
}

function TooltipRow({
	name,
	circleColor,
	textColor,
	value,
	formattingFn,
}: {
	name: string;
	circleColor: string;
	textColor: string;
	value: number;
	formattingFn: (n: number) => string;
}) {
	return (
		<div className={cn('flex justify-between gap-2', textColor)}>
			<div className="flex gap-2 items-center">
				<div className={cn('size-4 rounded-full', circleColor)}></div> {name}
			</div>
			<CountUp
				preserveValue
				end={value}
				duration={0.3}
				formattingFn={formattingFn}
			/>
		</div>
	);
}

function ScrollAreaForGraph({ children }: { children: ReactNode }) {
	const handleScrollCapture = useCallback(
		(e: React.UIEvent<HTMLDivElement>) => {
			const scrollContainer = e.target as HTMLDivElement;

			const axis = document.querySelector('.recharts-yAxis') as HTMLDivElement;
			if (!axis) return;

			axis.style.transform = `translateX(${scrollContainer.scrollLeft}px)`;

			let rect = axis.querySelector(
				'.y-axis-rect-horizontal'
			) as SVGRectElement | null;
			if (!rect) {
				rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
				rect.setAttribute('class', 'y-axis-rect-horizontal');
				axis.insertBefore(rect, axis.firstChild);
			}

			const { height: yAxisHeight, width: yAxisWidth } =
				axis.getBoundingClientRect();

			rect.setAttribute('x', '0');
			rect.setAttribute('y', '0');
			rect.setAttribute('width', yAxisWidth.toString());
			rect.setAttribute('height', (yAxisHeight + 10).toString());
			rect.setAttribute('fill', 'var(--card)');
		},
		[]
	);

	return (
		<ScrollArea
			className="whitespace-nowrap"
			onScrollCapture={handleScrollCapture}
		>
			{children}
			<ScrollAreaScrollbar orientation="horizontal" />
		</ScrollArea>
	);
}
