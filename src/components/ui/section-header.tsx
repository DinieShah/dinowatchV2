import type { ReactNode } from "react";

export function SectionHeader({
  title,
  action,
  className = "",
}: {
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mb-4 flex items-center justify-between gap-4 px-4 sm:px-6 ${className}`}
    >
      <h2 className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-ink sm:text-xl">
        <span className="h-4 w-[2px] bg-accent" aria-hidden />
        {title}
      </h2>
      {action}
    </div>
  );
}
