import { forwardRef } from "react";
import { cn } from "../lib/Utils";

import { SelectProps } from "../interface/Interfaces";

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            {label}
          </label>
        )}
        <select
          className={cn(
            "flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm",
            "appearance-none bg-no-repeat bg-[right_0.5rem_center]",
            "focus:outline-none focus:ring-2 focus:ring-primary-400",
            "focus:border-primary-400 disabled:cursor-not-allowed disabled:opacity-50",
            error &&
              "border-error-500 focus:ring-error-500 focus:border-error-500",
            className,
          )}
          ref={ref}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundSize: "1.5em 1.5em",
          }}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-error-600">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";
