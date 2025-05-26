
import { cn } from "../lib/Utils";
import type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from "../types/Types";

export const Card: React.FC<CardProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-secondary-200 shadow-sm p-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-1 pb-3", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <h3
      className={cn("text-lg font-semibold text-secondary-900", className)}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <p className={cn("text-sm text-secondary-500", className)} {...props}>
      {children}
    </p>
  );
};

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn("p-1", className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex items-center pt-3 border-t border-secondary-200 mt-auto p-1",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
