"use client";

import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Checkbox({
  checked,
  onCheckedChange,
  className,
  "aria-label": ariaLabel,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <RadixCheckbox.Root
      checked={checked}
      onCheckedChange={(value) => onCheckedChange(value === true)}
      aria-label={ariaLabel}
      className={cn(
        "flex size-[18px] shrink-0 items-center justify-center rounded-md border transition-colors",
        checked
          ? "border-accent bg-accent"
          : "border-border-strong bg-surface hover:border-accent/60",
        className,
      )}
    >
      <RadixCheckbox.Indicator forceMount asChild>
        <motion.span
          initial={false}
          animate={checked ? { scale: 1, opacity: 1 } : { scale: 0.4, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="flex items-center justify-center text-accent-foreground"
        >
          <Check className="size-3" strokeWidth={3} />
        </motion.span>
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  );
}
