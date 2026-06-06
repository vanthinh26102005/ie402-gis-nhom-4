import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options?: SelectOption[];
};

export function Select({ className, options = [], children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "h-14 w-full rounded-lg border border-brand-outline-variant bg-white px-3 text-base text-brand-secondary outline-none transition-[border-color,box-shadow] focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/10",
        className,
      )}
      {...props}
    >
      {children}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
