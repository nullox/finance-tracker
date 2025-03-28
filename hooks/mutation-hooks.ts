import { UpdateBalance } from "@/app/_actions/balance";
import { CreateCategory } from "@/app/_actions/category/create-category";
import { DeleteCategory } from "@/app/_actions/category/delete-category";
import { UpdateCategory } from "@/app/_actions/category/update-category";
import { UpdateCurrency } from "@/app/_actions/currency";
import { CreateTransaction } from "@/app/_actions/transaction/create-transaction";
import { DeleteTransaction } from "@/app/_actions/transaction/delete-transaction";
import { UpdateTransaction } from "@/app/_actions/transaction/update-transaction";
import { capitalize } from "@/lib/utils";
import { Category, Transaction } from "@prisma/client";
import {
  MutationFunction,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

type Action = "create" | "update" | "remove";

interface CreateHookParams<T> {
  itemName: string;
  actionName: Action;
  mutationFn: MutationFunction<T, any>;
  mutationKey: string[];
  getQueryKey: (item: T) => string[];
}

interface CreateSpecificHookParams<T> {
  mutationFn: MutationFunction<T, any>;
  actionName: Action;
}

interface HookParams<T> {
  onSuccess?: (item: T) => void;
}

// Helper functions
function getLoadingMessage(actionName: Action, itemName: string) {
  if (actionName === "create") {
    return `Creating new ${itemName}`;
  }
  if (actionName === "update") {
    return `Updating ${itemName}`;
  }
  return `Removing ${itemName}`;
}

function getSuccessMessage(actionName: Action, itemName: string) {
  return `${capitalize(itemName)} ${actionName}d successfully 🎉`;
}

// Generic hook generator
function createHook<T>({
  itemName,
  actionName,
  mutationFn,
  mutationKey,
  getQueryKey,
}: CreateHookParams<T>) {
  const toastId = `${actionName}-${itemName}`;

  const loadingMessage = getLoadingMessage(actionName, itemName);
  const successMessage = getSuccessMessage(actionName, itemName);
  const errorMessage = "Something went wrong";

  return ({ onSuccess }: HookParams<T> = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationKey,
      mutationFn,
      onMutate: () => {
        toast.loading(loadingMessage, { id: toastId });
      },
      onSuccess: (item: T) => {
        onSuccess?.(item);

        toast.success(successMessage, { id: toastId });
        queryClient.invalidateQueries({
          queryKey: getQueryKey(item),
        });
      },
      onError: (err) => {
        toast.error(errorMessage, { id: toastId });
        console.error(`[Mutation error] ${err}`);
      },
    });
  };
}

// Specific hook generators
function createCategoryHook(params: CreateSpecificHookParams<Category>) {
  return createHook<Category>({
    itemName: "category",
    mutationKey: ["category", params.actionName],
    getQueryKey: () => ["categories"],
    ...params,
  });
}

function createTransactionHook(params: CreateSpecificHookParams<Transaction>) {
  return createHook<Transaction>({
    itemName: "transaction",
    mutationKey: ["transaction", params.actionName],
    getQueryKey: () => ["transactions"],
    ...params,
  });
}

// Category hooks
export const useCreateCategory = createCategoryHook({
  mutationFn: CreateCategory,
  actionName: "create",
});

export const useDeleteCategory = createCategoryHook({
  mutationFn: DeleteCategory,
  actionName: "remove",
});

export const useUpdateCategory = createCategoryHook({
  mutationFn: UpdateCategory,
  actionName: "update",
});

// Transaction hooks
export const useCreateTransaction = createTransactionHook({
  mutationFn: CreateTransaction,
  actionName: "create",
});

export const useDeleteTransaction = createTransactionHook({
  mutationFn: DeleteTransaction,
  actionName: "remove",
});

export const useUpdateTransaction = createTransactionHook({
  mutationFn: UpdateTransaction,
  actionName: "update",
});

// Other hooks
export const useUpdateBalance = createHook<number>({
  mutationFn: UpdateBalance,
  actionName: "update",
  itemName: "balance",
  mutationKey: ["balance", "update"],
  getQueryKey: () => ["settings"],
});

export const useUpdateCurrency = createHook<string>({
  mutationFn: UpdateCurrency,
  actionName: "update",
  itemName: "currency",
  mutationKey: ["currency", "update"],
  getQueryKey: () => ["settings"],
});
