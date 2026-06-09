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

/** Open the global command palette (listened for in CommandPalette). */
export function openCommandPalette() {
  window.dispatchEvent(new CustomEvent("open-command-palette"));
}
