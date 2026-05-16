import { useEffect, useState, useCallback } from "react";

export const WISH_KEY = "mw_wish";
const EVT = "mw_wish_change";

export function readWish(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(WISH_KEY) || "[]"); } catch { return []; }
}

function writeWish(list: string[]) {
  localStorage.setItem(WISH_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(EVT));
}

export function useWishlist() {
  const [list, setList] = useState<string[]>([]);
  useEffect(() => {
    setList(readWish());
    const sync = () => setList(readWish());
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((slug: string) => {
    const cur = readWish();
    const next = cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug];
    writeWish(next);
    return next.includes(slug);
  }, []);

  const has = useCallback((slug: string) => list.includes(slug), [list]);

  return { list, has, toggle, count: list.length };
}