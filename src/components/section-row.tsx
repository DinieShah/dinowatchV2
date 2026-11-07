import type { ReactNode } from "react";
import { SectionHeader } from "@/components/ui/section-header";

// Horizontal scrolling section used by Continue Watching and similar rows.
export function SectionRow({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="py-6">
      <SectionHeader title={title} action={action} />
      <div className="no-scrollbar edge-fade flex gap-4 overflow-x-auto px-4 pb-2 sm:gap-5 sm:px-6">
        {children}
      </div>
    </section>
  );
}
