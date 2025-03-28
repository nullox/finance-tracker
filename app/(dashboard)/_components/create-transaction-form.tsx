"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TransactionType } from "@prisma/client";
import {
  createTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schema/transaction";
import CategoryPicker from "./category-picker";
import DatePicker from "./date-picker";
import { dateToYMD, YMDToDate } from "@/lib/utils";
import { useCreateTransaction } from "@/hooks/mutation-hooks";

interface Props {
  type: TransactionType;
  setOpen: (open: boolean) => void;
}

export function CreateTransactionForm({ type, setOpen }: Props) {
  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      amount: 0,
      description: "",
      type,
      date: dateToYMD(new Date()),
      categoryId: null,
    },
  });

  const { mutate } = useCreateTransaction({
    onSuccess: () => setOpen(false),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutate(data))}
        className="flex flex-col gap-4 pt-2"
      >
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min={0}
                  step={0.01}
                  value={field.value ?? ""}
                  className="border-border"
                />
              </FormControl>
              <FormDescription>Transaction amount (required)</FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="border-border"
                  maxLength={128}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormDescription>
                Transaction description (optional)
              </FormDescription>
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <FormField
            control={form.control}
            name="categoryId"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <CategoryPicker
                    type={type}
                    onPick={(category) => {
                      form.setValue("categoryId", category?.id || null, {
                        shouldValidate: true,
                      });
                    }}
                  />
                </FormControl>
                <FormDescription>Category for transaction</FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <DatePicker
                    currentDate={YMDToDate(field.value?.toString() || "")}
                    onPick={(date: Date) => {
                      form.setValue("date", dateToYMD(date), {
                        shouldValidate: true,
                      });
                    }}
                  />
                </FormControl>
                <FormDescription>Date for transaction</FormDescription>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            type="button"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </div>
      </form>
    </Form>
  );
}
