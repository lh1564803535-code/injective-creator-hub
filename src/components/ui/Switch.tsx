"use client";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: "sm" | "md";
  disabled?: boolean;
}

const sizeClasses = {
  sm: "h-5 w-9",
  md: "h-6 w-11",
};

const dotSizeClasses = {
  sm: "h-3.5 w-3.5",
  md: "h-4.5 w-4.5",
};

export function Switch({ checked, onChange, size = "md", disabled = false }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors ${
        checked ? "bg-cyan-500" : "bg-white/[0.06]"
      } ${sizeClasses[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span
        className={`pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        } ${dotSizeClasses[size]}`}
      />
    </button>
  );
}
