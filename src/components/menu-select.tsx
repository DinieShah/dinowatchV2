"use client";

import { useEffect, useRef, useState } from "react";

export interface MenuOption {
  value: string;
  label: string;
}

export function MenuSelect({
  icon,
  buttonLabel,
  value,
  options,
  onChange,
}: {
  icon?: string;
  buttonLabel: string;
  value: string;
  options: MenuOption[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-[2px] border border-hairline backdrop-blur-2xl bg-black/[0.25] ring-1 ring-inset ring-white/[0.12] px-3 py-1.5 font-mono text-xs text-ink shadow-none transition hover:bg-white/[0.10] cursor-pointer"
      >
        {icon && <span aria-hidden>{icon}</span>}
        <span>{buttonLabel}</span>
        <span aria-hidden className="text-ink-muted">
          ▾
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 min-w-[10rem] overflow-hidden rounded-[2px] border border-hairline backdrop-blur-2xl bg-black/[0.85] ring-1 ring-inset ring-white/[0.12] py-1 shadow-none divide-y divide-white/[0.06]"
        >
          {options.map((opt) => {
            const selected = opt.value === value;
            return (
              <li key={opt.value} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-4 px-3 py-1.5 text-left font-mono text-xs transition cursor-pointer ${
                    selected
                      ? "font-semibold text-ink bg-white/[0.08]"
                      : "text-ink-muted hover:bg-white/[0.06] hover:text-ink"
                  }`}
                >
                  {opt.label}
                  {selected && <span aria-hidden>✓</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
