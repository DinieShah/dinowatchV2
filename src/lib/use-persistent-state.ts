"use client";

import { useCallback, useSyncExternalStore } from "react";

// localStorage-backed string state that survives reloads/sessions. Built on
// useSyncExternalStore so SSR uses the provided default and the client
// reconciles to the stored value without a hydration mismatch.
export function usePersistentState(
  key: string,
  initial: string,
): readonly [string, (value: string) => void] {
  const subscribe = useCallback(
    (onChange: () => void) => {
      window.addEventListener("storage", onChange);
      window.addEventListener(`persist:${key}`, onChange);
      return () => {
        window.removeEventListener("storage", onChange);
        window.removeEventListener(`persist:${key}`, onChange);
      };
    },
    [key],
  );

  const getSnapshot = useCallback(() => {
    try {
      return localStorage.getItem(key) ?? initial;
    } catch {
      return initial;
    }
  }, [key, initial]);

  const getServerSnapshot = useCallback(() => initial, [initial]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (next: string) => {
      try {
        localStorage.setItem(key, next);
      } catch {
        // Ignore write failures (e.g. private mode / storage disabled).
      }
      window.dispatchEvent(new Event(`persist:${key}`));
    },
    [key],
  );

  return [value, setValue] as const;
}
