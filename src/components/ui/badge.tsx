// src/components/ui/badge.tsx
import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "green" | "blue" | "yellow" | "red";
}

export function Badge({
  className = "",
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  let classes = "badge";

  switch (variant) {
    case "secondary":
      classes += " badge-secondary";
      break;
    case "green":
      classes += " badge-green";
      break;
    case "blue":
      classes += " badge-blue";
      break;
    case "yellow":
      classes += " badge-yellow";
      break;
    case "red":
      classes += " badge-red";
      break;
  }

  return (
    <div className={`${classes} ${className}`} {...props}>
      {children}
    </div>
  );
}
