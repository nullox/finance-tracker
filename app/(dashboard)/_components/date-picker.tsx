"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

interface Props {
  onPick?: (date: Date) => void;
  currentDate?: Date;
}

export default function DatePicker({ onPick, currentDate }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex justify-between"
          role="combobox"
        >
          {!currentDate && <>Select date</>}
          {currentDate && (
            <>
              {currentDate.toLocaleString("default", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </>
          )}
          <CalendarIcon className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-fit">
        <Calendar
          onDayClick={(date) => {
            onPick?.(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
