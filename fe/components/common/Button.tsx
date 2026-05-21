import type { ComponentProps } from "react";
import { Button as BaseButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonProps = ComponentProps<typeof BaseButton>;

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  // Map brand classes based on variant
  const variantClasses = {
    default: "rounded-xl bg-brand-primary hover:bg-brand-primary-container text-white transition-all shadow-sm active:scale-[0.98] border-transparent",
    outline: "rounded-xl border border-brand-outline-variant/70 bg-transparent text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all",
    secondary: "rounded-xl bg-brand-secondary hover:bg-brand-secondary/90 text-white transition-all shadow-sm active:scale-[0.98] border-transparent",
    ghost: "rounded-xl bg-transparent text-slate-700 hover:bg-slate-100 active:scale-[0.98] transition-all",
    destructive: "rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-sm active:scale-[0.98] border-transparent",
    link: "text-brand-primary underline-offset-4 hover:underline bg-transparent border-transparent",
  };

  const selectedClass = variantClasses[variant as keyof typeof variantClasses] || variantClasses.default;

  return (
    <BaseButton
      variant={variant}
      className={cn(
        selectedClass,
        className,
      )}
      {...props}
    />
  );
}

