"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Options({
  children,
  Icon,
}: {
  children: React.ReactNode;
  Icon: React.ComponentType;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild className="bg-slate-900 size-max p-2">
        <Button variant="outline">
          <Icon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-max bg-slate-900 flex flex-col items-center p-1 space-y-1">
        {children}
      </PopoverContent>
    </Popover>
  );
}
