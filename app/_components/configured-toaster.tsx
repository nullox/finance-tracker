'use client';

import { useTheme } from 'next-themes';
import React from 'react';
import { Toaster } from 'sonner';

export default function ConfiguredToaster() {
	const { resolvedTheme } = useTheme();

	return (
		<Toaster
			richColors
			position="bottom-right"
			theme={resolvedTheme as 'light' | 'dark' | undefined}
		/>
	);
}
