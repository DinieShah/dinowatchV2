import type { ReactNode } from "react";

type Tone = "neutral" | "solid" | "star" | "live";

const tones: Record<Tone, string> = {
  neutral:
    "border border-white/[0.12] backdrop-blur-[40px] bg-black/[0.25] ring-1 ring-inset ring-white/[0.08] text-ink-muted shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
  solid:
    "border border-ink bg-ink text-paper shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
  star:
    "border border-white/[0.12] backdrop-blur-[40px] bg-black/[0.45] ring-1 ring-inset ring-white/[0.08] text-star shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
  live:
    "border border-accent/60 backdrop-blur-[40px] bg-black/[0.45] ring-1 ring-inset ring-accent/30 text-ink shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[2px] px-2 py-0.5 font-mono text-[11px] font-medium tabular-nums ${tones[tone]} ${className ?? ""}`}
    >
      {children}
    </span>
  );
}

export function StarRating({
  score,
  showValue = true,
  className = "",
}: {
  score: number;
  showValue?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[2px] border border-white/[0.12] backdrop-blur-[40px] bg-black/[0.25] ring-1 ring-inset ring-white/[0.08] px-2 py-0.5 font-mono text-xs tabular-nums shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${className}`}
    >
      <span className="text-star" aria-hidden>
        ★
      </span>
      {showValue && (
        <span className="font-semibold text-ink">{score.toFixed(1)}</span>
      )}
      <span className="text-ink-faint">/10</span>
    </span>
  );
}
