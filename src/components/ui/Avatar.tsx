"use client";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  fallback?: string;
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export function Avatar({ src, alt, size = "md", fallback, className = "" }: AvatarProps) {
  const initials = fallback || alt?.charAt(0)?.toUpperCase() || "?";

  if (src) {
    return (
      <img
        src={src}
        alt={alt || ""}
        className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 font-medium text-white ${sizeClasses[size]} ${className}`}
    >
      {initials}
    </div>
  );
}
