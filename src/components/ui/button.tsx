// src/components/ui/button.tsx
import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg";
}

export function Button({
  className = "",
  variant = "default",
  size = "default",
  children,
  ...props
}: ButtonProps) {
  let classes = "btn";

  if (variant === "outline") classes += " btn-outline";
  if (variant === "ghost") classes += " btn-ghost";
  if (variant === "secondary") classes += " btn-secondary";
  if (size === "sm") classes += " btn-sm";
  if (size === "lg") classes += " btn-lg";

  return (
    <button className={`${classes} ${className}`} {...props}>
      {children}
    </button>
  );
}
