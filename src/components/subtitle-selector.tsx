"use client";

import { MenuSelect } from "@/components/menu-select";
import type { SubtitleTrack } from "@/lib/types";

export const SUBTITLE_OFF = "off";

// Controlled subtitle language menu. Its value is owned by the watch experience
// so the selection can drive the player's active <track>.
export function SubtitleSelector({
  tracks,
  value,
  onChange,
}: {
  tracks: SubtitleTrack[];
  value: string;
  onChange: (lang: string) => void;
}) {
  const options = [
    ...tracks.map((t) => ({ value: t.lang, label: t.label })),
    { value: SUBTITLE_OFF, label: "Off" },
  ];

  const current =
    value === SUBTITLE_OFF
      ? "Off"
      : (tracks.find((t) => t.lang === value)?.label ?? "Off");

  return (
    <MenuSelect
      icon="CC"
      buttonLabel={`Subtitles: ${current}`}
      value={value}
      options={options}
      onChange={onChange}
    />
  );
}
