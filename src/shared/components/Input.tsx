import { forwardRef } from "react";

import { cn } from "../lib/Utils";
import { InputProps } from "../interface/Interfaces";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            {label}
          </label>
        )}
        <input
          className={cn(
            "flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm",
            "placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-400",
            "focus:border-primary-400 disabled:cursor-not-allowed disabled:opacity-50",
            error &&
              "border-error-500 focus:ring-error-500 focus:border-error-500",
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-error-600">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
