import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[2px] font-sans font-medium whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-[1.02] focus:outline-none focus-visible:ring-1 focus-visible:ring-ink disabled:opacity-60 disabled:pointer-events-none cursor-pointer";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-paper hover:bg-ink/90 border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
  secondary:
    "backdrop-blur-[40px] bg-white/[0.08] ring-1 ring-inset ring-white/[0.08] border border-white/[0.12] text-ink hover:bg-white/[0.12] hover:border-white/[0.22] shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
  ghost:
    "text-ink-muted hover:text-ink hover:bg-white/[0.12] border border-transparent",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-xs",
  md: "h-10 px-4 text-xs sm:text-sm",
  lg: "h-11 px-6 text-sm",
};

function classes(variant: Variant, size: Size, className?: string) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className ?? ""}`;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
} & ComponentProps<"button">) {
  return (
    <button className={classes(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
} & ComponentProps<typeof Link>) {
  return (
    <Link className={classes(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}
