"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Picker from "@emoji-mart/react";
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
import { Category } from "@prisma/client";
import { useState } from "react";
import { useUpdateCategory } from "@/hooks/mutation-hooks";
import { CircleOff } from "lucide-react";
import { useTheme } from "next-themes";
import { useResponsibleOverlay } from "@/hooks/use-responsible-overlay";
import { updateCategorySchema, UpdateCategorySchemaType } from "@/schema/category";

interface Props {
  category: Category;
  setOpen: (open: boolean) => void;
  onCategoryUpdate?: (category: Category) => void;
}

export function UpdateCategoryForm({
  category,
  setOpen,
  onCategoryUpdate,
}: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const theme = useTheme();

  const form = useForm<UpdateCategorySchemaType>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      id: category.id,
      name: category.name,
      icon: category.icon,
      type: category.type,
    },
  });

  const { mutate } = useUpdateCategory({
    onSuccess: (category: Category) => {
      setOpen(false);
      onCategoryUpdate?.(category);
    },
  });

  const {
    ResponsibleOverlay,
    ResponsibleOverlayContent,
    ResponsibleOverlayTitle,
    ResponsibleOverlayTrigger,
  } = useResponsibleOverlay();

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          event.stopPropagation();
          form.handleSubmit((data) => mutate(data))(event);
        }}
        className="flex flex-col gap-4 pt-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} className="border-border" />
              </FormControl>
              <FormDescription>Category name (required)</FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <ResponsibleOverlay
                  open={pickerOpen}
                  onOpenChange={setPickerOpen}
                >
                  {ResponsibleOverlayTitle && (
                    <ResponsibleOverlayTitle className="sr-only">
                      Select an icon
                    </ResponsibleOverlayTitle>
                  )}
                  <ResponsibleOverlayTrigger asChild>
                    <Button
                      variant="outline"
                      type="button"
                      className="h-30 w-full flex flex-col gap-2 justify-center items-center"
                      onClick={() => setPickerOpen((prev) => !prev)}
                    >
                      <span className="text-4xl" role="img">
                        {field.value || <CircleOff className="size-8" />}
                      </span>
                      <span className="text-muted-foreground">
                        {field.value ? "Click to change" : "Click to select"}
                      </span>
                    </Button>
                  </ResponsibleOverlayTrigger>
                  <ResponsibleOverlayContent className="p-0 w-full">
                    <Picker
                      style={{
                        width: "100px",
                      }}
                      theme={theme.resolvedTheme}
                      onEmojiSelect={(emoji: { native: string }) => {
                        form.setValue("icon", emoji.native, {
                          shouldValidate: true,
                        });
                        setPickerOpen(false);
                      }}
                      autoFocus
                    />
                  </ResponsibleOverlayContent>
                </ResponsibleOverlay>
              </FormControl>
              <FormDescription>Category icon (required)</FormDescription>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            type="button"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit">Update</Button>
        </div>
      </form>
    </Form>
  );
}
