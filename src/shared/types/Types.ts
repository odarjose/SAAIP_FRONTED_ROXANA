export type AvatarProps = {
  src?: string;
  alt?: string;
  name?: string;
  surname?: string;
  
  size?: "sm" | "md" | "lg";
  className?: string;
};

export type BadgeProps = {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error";
  children: React.ReactNode;
  className?: string;
};

export type ButtonProps = {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "link"
    | "success"
    | "warning"
    | "error";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export type CardHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

export type CardTitleProps = {
  children: React.ReactNode;
  className?: string;
};

export type CardDescriptionProps = {
  children: React.ReactNode;
  className?: string;
};

export type CardContentProps = {
  children: React.ReactNode;
  className?: string;
  
};

export type CardFooterProps = {
  children: React.ReactNode;
  className?: string;
};
