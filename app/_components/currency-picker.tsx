"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { currencies, Currency } from "@/lib/currencies";
import { cn } from "@/lib/utils";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { useSettings } from "@/hooks/query-hooks";
import { useUpdateCurrency } from "@/hooks/mutation-hooks";

export default function CurrencyPicker() {
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency | null>(null);

  const { data, isPending } = useSettings();

  const { mutate } = useUpdateCurrency();

  const handleSelect = (currency: Currency) => {
    setCurrency(currency);
    setOpen(false);
    mutate(currency.value);
  };

  useEffect(() => {
    const currency =
      currencies.find((currency) => currency.value === data?.currency) ||
      currencies[0];

    setCurrency(currency);
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Currency</CardTitle>
        <CardDescription>
          Set your default currency for transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SkeletonWrapper isLoading={isPending}>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {currency?.label}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search currency..."
                  className="h-9"
                />
                <CommandList>
                  <CommandGroup>
                    {currencies.map((current) => (
                      <CommandItem
                        key={current.value}
                        value={current.label}
                        onSelect={() => handleSelect(current)}
                      >
                        {current.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            currency?.value === current.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </SkeletonWrapper>
      </CardContent>
    </Card>
  );
}
