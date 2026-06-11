"use client";

import { useEffect, useState } from "react";

/** True after first client mount, guards against hydration mismatches. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/** Tracks the user's reduced-motion preference, reactively. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

/**
 * Types `text` out character by character. Respects reduced motion
 * (renders instantly) and resets cleanly when inputs change.
 */
export function useTypewriter(
  text: string,
  opts?: { speed?: number; startDelay?: number; enabled?: boolean },
) {
  const { speed = 36, startDelay = 0, enabled = true } = opts ?? {};
  const reduced = usePrefersReducedMotion();
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setOut("");
      setDone(false);
      return;
    }
    if (reduced) {
      setOut(text);
      setDone(true);
      return;
    }
    setOut("");
    setDone(false);
    let i = 0;
    let tick: ReturnType<typeof setTimeout>;
    const start = setTimeout(function step() {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) {
        setDone(true);
        return;
      }
      tick = setTimeout(step, speed);
    }, startDelay);
    return () => {
      clearTimeout(start);
      clearTimeout(tick);
    };
  }, [text, speed, startDelay, enabled, reduced]);

  return { out, done, reduced };
}
