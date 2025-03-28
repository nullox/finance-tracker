import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Transaction } from "@prisma/client";
import React from "react";
import { UpdateTransactionForm } from "./update-transaction-form";

interface Props {
  transaction: Transaction;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function UpdateTransactionDialog({
  transaction,
  open,
  setOpen,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit transaction</DialogTitle>
          <UpdateTransactionForm transaction={transaction} setOpen={setOpen} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
