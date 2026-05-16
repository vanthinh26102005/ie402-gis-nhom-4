import type { ComponentProps } from "react";
import { Button as BaseButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonProps = ComponentProps<typeof BaseButton>;

export function Button({ className, ...props }: ButtonProps) {
  return (
    <BaseButton
      className={cn(
        "rounded-md bg-blue-700 text-white hover:bg-blue-800",
        className,
      )}
      {...props}
    />
  );
}
