'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

interface Props {
	children: ReactNode;
}

export default function Providers({ children }: Props) {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				{children}
			</ThemeProvider>
			<ReactQueryDevtools />
		</QueryClientProvider>
	);
}
