import React from "react";

import { cn, getInitials } from "../lib/Utils";

import type { AvatarProps } from "../types/Types";

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  surname,
  size = "md",
  className,
  ...props
}) => {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  const initials =
    name && surname ? getInitials(name, surname) : alt?.charAt(0) || "?";

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-full bg-secondary-200 text-secondary-700 font-medium",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};
