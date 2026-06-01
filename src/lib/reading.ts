"use client";

import { useSyncExternalStore } from "react";

/**
 * Per-visitor reading progress, kept in this browser only (like a browser's
 * reading list). `pos` is where the reader left off, `max` how far they got.
 */
export interface ReadingEntry {
  pos: number;
  max: number;
  at: number;
}

type Store = Record<string, ReadingEntry>;

const KEY = "reading-progress";
/** Past this share of the article a post counts as read. */
export const READ_AT = 0.9;

const EMPTY: Store = {};
let cache: Store | null = null;
const listeners = new Set<() => void>();

function load(): Store {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    cache = parsed && typeof parsed === "object" ? (parsed as Store) : {};
  } catch {
    cache = {};
  }
  return cache;
}

function emit() {
  listeners.forEach((l) => l());
}

export function saveReading(slug: string, pos: number) {
  const store = load();
  const prev = store[slug];
  const clamped = Math.min(1, Math.max(0, pos));
  // Ignore jitter so scrolling doesn't rewrite storage on every frame
  if (prev && Math.abs(prev.pos - clamped) < 0.01 && clamped <= prev.max) return;
  cache = {
    ...store,
    [slug]: { pos: clamped, max: Math.max(prev?.max ?? 0, clamped), at: Date.now() },
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    // Storage full or blocked: progress just isn't remembered
  }
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    cache = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Progress for one post; undefined on the server and for unread posts. */
export function useReading(slug: string): ReadingEntry | undefined {
  const store = useSyncExternalStore(subscribe, load, () => EMPTY);
  return store[slug];
}
