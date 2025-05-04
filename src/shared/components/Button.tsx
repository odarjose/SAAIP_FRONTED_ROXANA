import React from "react";
import { cn } from "../lib/Utils";
import type { ButtonProps } from "../types/Types";

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className,
  disabled = false,
  isLoading = false,
  type = "button",
  onClick,
  ...props
}) => {
  const variantClasses = {
    primary:
      "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
    secondary:
      "bg-secondary-200 text-secondary-900 hover:bg-secondary-300 focus:ring-secondary-300",
    outline:
      "border border-secondary-300 bg-transparent hover:bg-secondary-100 text-secondary-700",
    ghost: "bg-transparent text-secondary-700 hover:bg-secondary-100",
    link: "bg-transparent text-primary-600 hover:underline p-0 h-auto",
    success:
      "bg-success-600 text-white hover:bg-success-500 focus:ring-success-500",
    warning:
      "bg-warning-600 text-white hover:bg-warning-500 focus:ring-warning-500",
    error: "bg-error-600 text-white hover:bg-error-500 focus:ring-error-500",
  };

  const sizeClasses = {
    sm: "h-8 px-3 py-1 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-6 py-2.5 text-base",
  };

  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};
