"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Category } from "@prisma/client";
import React, { ReactNode, useState } from "react";
import { UpdateCategoryForm } from "./update-category-form";

interface Props {
  category: Category;
  trigger: ReactNode;
  onUpdateCategory?: (category: Category) => void;
}

export default function UpdateCategoryDialog({
  category,
  trigger,
  onUpdateCategory,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit category</DialogTitle>
        </DialogHeader>
        <UpdateCategoryForm
          category={category}
          setOpen={setOpen}
          onCategoryUpdate={onUpdateCategory}
        />
      </DialogContent>
    </Dialog>
  );
}
