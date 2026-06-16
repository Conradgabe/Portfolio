/** Smooth-scroll to an in-page anchor like "/#projects" or "#about". */
export function smoothScrollTo(href: string) {
  const id = href.replace(/^\/?#/, "");
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    // Move focus for keyboard users without an extra visible jump.
    el.setAttribute("tabindex", "-1");
    (el as HTMLElement).focus({ preventScroll: true });
  }
}

/**
 * Navigate to a destination that may be an in-page section anchor.
 * If the section exists on the current page, smooth-scroll to it.
 * Otherwise (e.g. on a /projects/* route) route to the home page with
 * the hash, where HashScroll picks it up on mount.
 */
export function navTo(href: string, router: { push: (href: string) => void }) {
  const isAnchor = href.startsWith("#") || href.startsWith("/#");
  if (!isAnchor) {
    router.push(href);
    return;
  }
  const id = href.replace(/^\/?#/, "");
  if (typeof document !== "undefined" && document.getElementById(id)) {
    smoothScrollTo(href);
  } else {
    router.push(`/#${id}`);
  }
}

/** Open the global command palette (listened for in CommandPalette). */
export function openCommandPalette() {
  window.dispatchEvent(new CustomEvent("open-command-palette"));
}
