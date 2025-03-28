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
  values: number[];
  year: number;
  onYearChange: (year: number) => void;
}

export default function SelectYear({ values, year, onYearChange }: Props) {
  return (
    <Select
      value={year.toString()}
      onValueChange={(value) => onYearChange(parseInt(value))}
    >
      <SelectTrigger className="w-[50%] md:w-[160px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {values.map((value) => {
            return (
              <SelectItem key={value} value={value.toString()}>
                {value}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
