"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Edit2,
  PlusSquare,
  Trash,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import React from "react";
import CreateCategoryDialog from "./create-category-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { Category, TransactionType } from "@prisma/client";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/query-hooks";
import { useDeleteCategory } from "@/hooks/mutation-hooks";
import ConfirmRemoveDialog from "./confirm-remove-dialog";
import UpdateCategoryDialog from "./update-category-dialog";

export default function CategoriesManager() {
  const { data: categoriesByType, isPending } = useCategories();
  const deleteCategory = useDeleteCategory();

  function onRemove(category: Category) {
    deleteCategory.mutate({ id: category.id });
  }

  return (
    <div className="space-y-6">
      <CategorySection
        type="INCOME"
        isLoading={isPending}
        categories={categoriesByType?.INCOME}
        onRemove={onRemove}
      />
      <CategorySection
        type="EXPENSE"
        isLoading={isPending}
        categories={categoriesByType?.EXPENSE}
        onRemove={onRemove}
      />
    </div>
  );
}

function CategorySection({
  type,
  isLoading,
  categories,
  onRemove,
}: {
  type: TransactionType;
  isLoading: boolean;
  categories?: Category[];
  onRemove: (category: Category) => void;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-center">
        <div className="flex gap-2 items-center">
          {type === "INCOME" ? (
            <TrendingUp className="bg-emerald-500/10 text-emerald-400 size-16 sm:size-12 rounded-md p-2" />
          ) : (
            <TrendingDown className="bg-red-500/10 text-red-400 size-16 sm:size-12 rounded-md p-2" />
          )}
          <div>
            <CardTitle className="text-2xl">
              {type === "INCOME" ? "Incomes" : "Expenses"} categories
            </CardTitle>
            <CardDescription className="text-md">
              Sorted by name
            </CardDescription>
          </div>
        </div>
        <CreateCategoryDialog
          type={type}
          trigger={
            <Button>
              <PlusSquare /> Create category
            </Button>
          }
        />
      </CardHeader>
      <Separator />
      <CardContent>
        <SkeletonWrapper isLoading={isLoading} fullWidth className="h-[140px]">
          {!categories?.length && (
            <div className="flex justify-center items-center flex-col h-[140px]">
              <div>
                No
                <span
                  className={cn(
                    "text-lg px-1",
                    type === "INCOME" ? "text-emerald-500" : "text-red-500",
                  )}
                >
                  {type === "INCOME" ? "income" : "expense"}
                </span>
                categories yet
              </div>
              <span className="text-muted-foreground">
                Create one to get started
              </span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
            {categories?.map((category) => (
              <CategoryItem
                category={category}
                key={category.id}
                onRemove={onRemove}
              />
            ))}
          </div>
        </SkeletonWrapper>
      </CardContent>
    </Card>
  );
}

function CategoryItem({
  category,
  onRemove,
}: {
  category: Category;
  onRemove: (category: Category) => void;
}) {
  return (
    <div className="border w-full rounded-md bg-card flex flex-col">
      <div className="flex justify-center items-center flex-col h-[100px] gap-2">
        <span className="text-3xl">{category.icon}</span>
        {category.name}
      </div>
      <div className="flex">
        <UpdateCategoryDialog
          category={category}
          trigger={
            <Button
              variant="secondary"
              className="w-[50%] hover:text-foreground rounded-t-none text-muted-foreground rounded-r-none hover:bg-popover"
            >
              <Edit2 /> Edit
            </Button>
          }
        />
        <ConfirmRemoveDialog
          itemName="category"
          onConfirm={() => onRemove(category)}
          trigger={
            <Button
              variant="secondary"
              className="hover:bg-red-500/70 w-[50%] hover:text-white rounded-t-none text-muted-foreground rounded-l-none"
            >
              <Trash /> Remove
            </Button>
          }
        />
      </div>
    </div>
  );
}
