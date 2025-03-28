import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Category, TransactionType } from "@prisma/client";
import { Check, ChevronsUpDown, SquarePlus } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import CreateCategoryDialog from "@/app/(dashboard)/_components/create-category-dialog";
import { Separator } from "@/components/ui/separator";
import { useCategories } from "@/hooks/query-hooks";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  categoryId?: number | null;
  type: TransactionType;
  onPick?: (category: Category | null) => void;
}

export default function CategoryPicker({ categoryId, type, onPick }: Props) {
  const [category, setCategory] = useState<Category | null>(null);
  const [open, setOpen] = useState(false);

  const { data, isPending } = useCategories({ type });

  const handleSelect = useCallback(
    (category: Category | null) => {
      onPick?.(category);
      setCategory(category);
      setOpen(false);
    },
    [onPick, setCategory, setOpen],
  );

  useEffect(() => {
    if (!categoryId && categoryId !== 0) return;

    const newCategory = data?.[type].find((item) => item.id === categoryId);
    if (!newCategory) return;

    setCategory(newCategory);
  }, [data, categoryId, type]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          type="button"
          className="flex justify-between"
          role="combobox"
        >
          {!category && <>No category</>}
          {category && (
            <span className="flex gap-2">
              <span>{category.icon}</span> <span>{category.name}</span>
            </span>
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="sm:w-50 p-0">
        <SkeletonWrapper isLoading={isPending}>
          <Command>
            <CommandInput placeholder="Search category..." />
            <CreateCategoryDialog
              onCreateCategory={handleSelect}
              type={type}
              trigger={
                <Button
                  type="button"
                  variant="outline"
                  className="px-4 py-2 text-muted-foreground flex justify-start border-none"
                >
                  <SquarePlus /> Create new
                </Button>
              }
            />
            <Separator />
            <CommandList>
              <CommandEmpty>No categories found.</CommandEmpty>
              {data?.[type]?.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => {
                    const selected = item === category ? null : item;
                    handleSelect(selected);
                  }}
                  className="h-9 cursor-pointer rounded-md flex justify-between"
                >
                  <div className="flex gap-2 items-center">
                    <span className="text-lg">{item.icon}</span>
                    {item.name}
                  </div>
                  {item === category && <Check />}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </SkeletonWrapper>
      </PopoverContent>
    </Popover>
  );
}
