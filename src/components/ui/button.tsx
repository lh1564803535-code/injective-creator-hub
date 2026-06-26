"use client";

import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variantClasses = {
  primary: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90",
  secondary: "border border-white/[0.08] bg-white/[0.03] text-white hover:bg-white/[0.06]",
  ghost: "text-gray-400 hover:text-white hover:bg-white/[0.04]",
  danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading = false, children, className = "", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition ${
          variantClasses[variant]
        } ${sizeClasses[size]} ${
          disabled || loading ? "opacity-50 cursor-not-allowed" : ""
        } ${className}`}
        {...props}
      >
        {loading && (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
