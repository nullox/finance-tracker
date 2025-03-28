"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionType } from "@prisma/client";
import React, { ReactNode, useState } from "react";
import { CreateTransactionForm } from "./create-transaction-form";

interface Props {
  type: TransactionType;
  trigger: ReactNode;
}

export default function CreateTransactionDialog({ type, trigger }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create a new{" "}
            <span
              className={
                type === "INCOME" ? "text-emerald-500" : "text-red-500"
              }
            >
              {type.toLowerCase()}
            </span>{" "}
            transaction
          </DialogTitle>
          <CreateTransactionForm type={type} setOpen={setOpen} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
