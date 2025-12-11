import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "accent" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const sizeClasses = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const variantClasses = {
  primary: `
    bg-theme-primary text-theme-text-on-primary
    hover:bg-theme-primary-hover
    focus:ring-theme-primary
  `,
  accent: `
    bg-theme-accent text-theme-text-on-accent
    hover:bg-theme-accent-hover
    focus:ring-theme-accent
  `,
  outline: `
    bg-transparent text-theme-primary border-2 border-theme-primary
    hover:bg-theme-primary hover:text-theme-text-on-primary
    focus:ring-theme-primary
  `,
  ghost: `
    bg-transparent text-theme-text-secondary
    hover:bg-theme-surface-secondary
    focus:ring-theme-border
  `,
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center rounded-xl font-semibold
        transition-all duration-200 active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        shadow-soft-sm hover:shadow-soft
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
