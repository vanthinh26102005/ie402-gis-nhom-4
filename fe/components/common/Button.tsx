import type { ComponentProps } from "react";
import { Button as BaseButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonProps = ComponentProps<typeof BaseButton>;

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  const variantClasses = {
    default: "rounded-lg border-transparent bg-brand-primary text-white shadow-none transition-[background-color,border-color,color,box-shadow] hover:bg-brand-primary-container disabled:bg-[#ffd1da] disabled:text-white",
    outline: "rounded-lg border border-brand-secondary bg-white text-brand-secondary shadow-none transition-[background-color,border-color,color,box-shadow] hover:bg-brand-surface-low",
    secondary: "rounded-lg border border-brand-secondary bg-white text-brand-secondary shadow-none transition-[background-color,border-color,color,box-shadow] hover:bg-brand-surface-low",
    ghost: "rounded-lg bg-transparent text-brand-secondary shadow-none transition-[background-color,color] hover:bg-brand-surface-low",
    destructive: "rounded-lg border-transparent bg-brand-danger text-white shadow-none transition-[background-color,border-color,color] hover:bg-[#b32505]",
    link: "bg-transparent text-brand-secondary underline-offset-4 hover:underline border-transparent",
  };

  const selectedClass = variantClasses[variant as keyof typeof variantClasses] || variantClasses.default;

  return (
    <BaseButton
      variant={variant}
      className={cn(
        "min-h-11 px-5 font-medium focus-visible:ring-brand-secondary/25",
        selectedClass,
        className,
      )}
      {...props}
    />
  );
}
