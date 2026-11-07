"use client";

import { MenuSelect } from "@/components/menu-select";
import type { QualityOption } from "@/lib/types";

export const QUALITY_AUTO = "auto";

export function QualitySelector({
  qualities,
  value,
  onChange,
}: {
  qualities: QualityOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  const options = [
    { value: QUALITY_AUTO, label: "Auto" },
    ...qualities.map((q) => ({ value: String(q.height), label: q.label })),
  ];

  const current = options.find((o) => o.value === value)?.label ?? "Auto";

  return (
    <MenuSelect
      icon="HD"
      buttonLabel={`Quality: ${current}`}
      value={value}
      options={options}
      onChange={onChange}
    />
  );
}
