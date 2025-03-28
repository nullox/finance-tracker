import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

interface Props {
  month: number;
  onMonthChange: (month: number) => void;
}

export default function SelectMonth({ month, onMonthChange }: Props) {
  return (
    <Select
      value={month.toString()}
      onValueChange={(value) => onMonthChange(parseInt(value))}
    >
      <SelectTrigger className="w-[50%] md:w-[160px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Array.from({ length: 12 }, (_, i) => {
            const name = new Date(1970, i).toLocaleString("default", {
              month: "long",
            });

            return (
              <SelectItem key={i} value={i.toString()}>
                {name}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
