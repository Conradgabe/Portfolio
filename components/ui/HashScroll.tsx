"use client";

import { useEffect } from "react";
import { smoothScrollTo } from "@/lib/scroll";

/**
 * On the home page, scroll to the section named in the URL hash after mount.
 * Handles arriving from another route (e.g. a project page) via /#about, where
 * the browser's native hash-scroll fires before the sections have laid out.
 */
export function HashScroll() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash === "#top") return;
    // Wait a frame so lazy/animated sections are in the DOM before scrolling.
    const t = setTimeout(() => smoothScrollTo(hash), 80);
    return () => clearTimeout(t);
  }, []);

  return null;
}
