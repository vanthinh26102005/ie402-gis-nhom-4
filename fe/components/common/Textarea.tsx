import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full resize-y rounded-lg border border-brand-outline-variant bg-white px-3.5 py-3 text-base text-brand-secondary outline-none transition-[border-color,box-shadow] placeholder:text-[#6a6a6a] focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/10",
        className,
      )}
      {...props}
    />
  );
}
