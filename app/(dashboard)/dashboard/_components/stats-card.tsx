import SkeletonWrapper from "@/components/skeleton-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";
import CountUp from "react-countup";

interface Props {
  value: number;
  isLoading: boolean;
  difference?: number;
  title: string;
  icon: ReactNode;
  formattingFn: (n: number) => string;
}

export default function StatsCard({
  value,
  isLoading,
  difference,
  title,
  icon,
  formattingFn,
}: Props) {
  return (
    <Card className="relative flex-1/3">
      <CardContent className="flex gap-2 items-center">
        {icon}
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-lg">{title}</span>
            {difference ? (
              <span
                className={cn(
                  "text-sm absolute top-2 right-4 p-1",
                  difference > 0
                    ? "text-emerald-400 bg-emerald-500/10 rounded-sm"
                    : "text-orange-400 bg-orange-500/10 rounded-sm",
                )}
              >
                {difference > 0 ? "+" : ""}
                <CountUp
                  preserveValue
                  end={difference}
                  duration={1}
                  formattingFn={formattingFn}
                  decimals={2}
                />
              </span>
            ) : null}
          </div>
          <SkeletonWrapper isLoading={isLoading}>
            {isLoading && <>&nbsp;</>}
            <CountUp
              preserveValue
              end={value}
              duration={1}
              formattingFn={formattingFn}
              className="text-xl"
              decimals={2}
            />
          </SkeletonWrapper>
        </div>
      </CardContent>
    </Card>
  );
}
