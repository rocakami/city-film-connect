import { useEffect, useState, useCallback } from "react";

const KEY = "ccn.registrations";

function read(userId: string): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    const all = raw ? (JSON.parse(raw) as Record<string, string[]>) : {};
    return new Set(all[userId] ?? []);
  } catch {
    return new Set();
  }
}

function write(userId: string, set: Set<string>) {
  const raw = localStorage.getItem(KEY);
  const all = raw ? JSON.parse(raw) : {};
  all[userId] = [...set];
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function useEventRegistrations(userId: string | undefined) {
  const [regs, setRegs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (userId) setRegs(read(userId));
  }, [userId]);

  const toggle = useCallback(
    (eventId: string) => {
      if (!userId) return;
      setRegs((prev) => {
        const next = new Set(prev);
        if (next.has(eventId)) next.delete(eventId);
        else next.add(eventId);
        write(userId, next);
        return next;
      });
    },
    [userId]
  );

  const isRegistered = useCallback((id: string) => regs.has(id), [regs]);

  return { regs, toggle, isRegistered };
}
