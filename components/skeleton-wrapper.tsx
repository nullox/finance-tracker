import React, { ReactNode } from "react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

interface Props {
  isLoading: boolean;
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export default function SkeletonWrapper({
  children,
  isLoading,
  fullWidth = false,
  className,
}: Props) {
  if (!isLoading) return children;

  return (
    <Skeleton className={cn(fullWidth && "w-full", className)}>
      <div className="opacity-0 pointer-events-none">{children}</div>
    </Skeleton>
  );
}
