import React from "react";
import { cn } from "../lib/Utils";
import type { BadgeProps } from "../types/Types";

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  children,
  className,
  ...props
}) => {
  const variantClasses = {
    default: "bg-secondary-100 text-secondary-800",
    primary: "bg-primary-100 text-primary-800",
    secondary: "bg-secondary-100 text-secondary-800",
    success: "bg-success-50 text-success-600",
    warning: "bg-warning-50 text-warning-600",
    error: "bg-error-50 text-error-600",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};
