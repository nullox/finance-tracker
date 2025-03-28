"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Category, TransactionType } from "@prisma/client";
import React, { ReactNode, useState } from "react";
import { CreateCategoryForm } from "./create-category-form";

interface Props {
  type: TransactionType;
  trigger: ReactNode;
  onCreateCategory?: (category: Category) => void;
}

export default function CreateCategoryDialog({
  type,
  trigger,
  onCreateCategory,
}: Props) {
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
            category
          </DialogTitle>
        </DialogHeader>
        <CreateCategoryForm
          type={type}
          setOpen={setOpen}
          onCategoryCreate={onCreateCategory}
        />
      </DialogContent>
    </Dialog>
  );
}
