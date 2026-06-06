import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-14 w-full rounded-lg border border-brand-outline-variant bg-white px-3.5 text-base text-brand-secondary outline-none transition-[border-color,box-shadow] placeholder:text-[#6a6a6a] focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/10",
        className,
      )}
      {...props}
    />
  );
}
