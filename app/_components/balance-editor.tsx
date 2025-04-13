"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { useSettings } from "@/hooks/query-hooks";
import { useUpdateBalance } from "@/hooks/mutation-hooks";
import { toast } from "sonner";

export default function BalanceEditor() {
  const { data: settings, isPending } = useSettings();
  const mutation = useUpdateBalance();

  const [balance, setBalance] = useState("0");
  const [prevBalance, setPrevBalance] = useState(0);

  useEffect(() => {
    if (!settings) return;
    setBalance(settings.balance.toString());
    setPrevBalance(settings.balance);
  }, [settings]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setBalance(e.target.value);
  }, []);

  const handleBlur = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.trim();
      const balance = parseFloat(value);

      if (balance === prevBalance) return;

      if (isNaN(balance)) {
        setBalance(prevBalance.toString());
        return toast.error("Please enter a valid number");
      }

      mutation.mutate(balance, {
        onSuccess: () => setPrevBalance(balance),
      });
    },
    [mutation, prevBalance],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Balance</CardTitle>
        <CardDescription>
          Set your current balance to keep track on it
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SkeletonWrapper isLoading={isPending}>
          <Input
            placeholder="Balance"
            value={balance}
            onChange={handleChange}
            onBlur={handleBlur}
            type="number"
            aria-label="Current balance"
            step={0.01}
          />
        </SkeletonWrapper>
      </CardContent>
    </Card>
  );
}
