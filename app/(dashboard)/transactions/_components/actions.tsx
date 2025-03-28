'use client';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Transaction } from '@prisma/client';
import { Separator } from '@radix-ui/react-separator';
import { MoreHorizontal, Edit2, Trash } from 'lucide-react';
import React, { useState } from 'react';
import ConfirmRemoveDialog from '../../_components/confirm-remove-dialog';
import UpdateTransactionDialog from '../../_components/update-transaction-dialog';
import { Button } from '@/components/ui/button';

interface Props {
	transaction: Transaction;
	onRemove?: (transaction: Transaction) => void;
}

export default function Actions({ transaction, onRemove }: Props) {
	const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
	const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel className="font-bold">Actions</DropdownMenuLabel>
					<Separator />
					<DropdownMenuItem onClick={() => setUpdateDialogOpen(true)}>
						<Edit2 /> Edit
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setRemoveDialogOpen(true)}>
						<Trash /> Remove
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<ConfirmRemoveDialog
				itemName="transaction"
				onConfirm={() => onRemove?.(transaction)}
				open={removeDialogOpen}
				setOpen={setRemoveDialogOpen}
			/>
			<UpdateTransactionDialog
				transaction={transaction}
				open={updateDialogOpen}
				setOpen={setUpdateDialogOpen}
			/>
		</>
	);
}
