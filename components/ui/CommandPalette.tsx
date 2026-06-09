"use client";

import { Command } from "cmdk";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, CornerDownLeft } from "lucide-react";
import { commands, projects, site } from "@/lib/site";
import { smoothScrollTo } from "@/lib/scroll";

/**
 * Global ⌘K command palette. Opens via ⌘K / Ctrl+K or the
 * "open-command-palette" window event (dispatched by nav buttons).
 * Built on cmdk's primitive inside a custom terminal-styled modal.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    function onOpen() {
      setOpen(true);
    }
    document.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onOpen);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onOpen);
    };
  }, []);

  // Lock scroll while open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const run = useCallback((fn: () => void) => {
    setOpen(false);
    fn();
  }, []);

  function go(href: string) {
    if (href.startsWith("/#") || href.startsWith("#")) {
      smoothScrollTo(href);
    } else {
      router.push(href);
    }
  }

  function toggleTheme() {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  function toggleCrt() {
    const on = document.documentElement.dataset.crt === "on";
    if (on) {
      delete document.documentElement.dataset.crt;
    } else {
      document.documentElement.dataset.crt = "on";
    }
    try {
      localStorage.setItem("crt", on ? "off" : "on");
    } catch {}
  }

  function copyEmail() {
    navigator.clipboard?.writeText(site.email).catch(() => {});
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]"
      role="presentation"
      onClick={() => setOpen(false)}
    >
      <div className="absolute inset-0 bg-bg/70 backdrop-blur-sm" aria-hidden />
      <div
        className="relative w-full max-w-xl border border-line-strong bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Command menu" className="font-mono" loop>
          <div className="flex items-center gap-2 border-b border-line px-4 py-3">
            <span className="text-accent-ink">$</span>
            <Command.Input
              autoFocus
              placeholder="type a command or search…"
              className="w-full bg-transparent text-sm text-ink placeholder:text-faint outline-none"
            />
            <kbd className="hidden shrink-0 border border-line px-1.5 py-0.5 text-[10px] text-faint sm:block">
              esc
            </kbd>
          </div>
          <Command.List className="max-h-[52vh] overflow-y-auto p-2">
            <Command.Empty className="px-3 py-6 text-center text-sm text-faint">
              No matches. Try &ldquo;projects&rdquo; or &ldquo;contact&rdquo;.
            </Command.Empty>

            <PaletteGroup heading="navigate">
              {commands.map((c) => (
                <PaletteItem
                  key={c.cmd}
                  value={`${c.cmd} ${c.label} ${c.description}`}
                  onSelect={() => run(() => go(c.href))}
                  left={<span className="text-accent-ink">{c.cmd}</span>}
                  right={c.label}
                />
              ))}
            </PaletteGroup>

            <PaletteGroup heading="projects">
              {projects.map((p) => (
                <PaletteItem
                  key={p.slug}
                  value={`${p.name} ${p.category} ${p.tagline}`}
                  onSelect={() => run(() => go(`/projects/${p.slug}`))}
                  left={<span className="text-ink">{p.name}</span>}
                  right={p.category}
                />
              ))}
            </PaletteGroup>

            <PaletteGroup heading="links">
              {site.socials.map((s) => (
                <PaletteItem
                  key={s.label}
                  value={`${s.label} ${s.handle} ${s.command}`}
                  onSelect={() => run(() => window.open(s.href, "_blank", "noopener,noreferrer"))}
                  left={<span className="text-ink">{s.label}</span>}
                  right={s.handle}
                  external
                />
              ))}
            </PaletteGroup>

            <PaletteGroup heading="actions">
              <PaletteItem value="toggle theme light dark" onSelect={() => run(toggleTheme)} left="toggle theme" />
              <PaletteItem value="toggle crt scanlines retro" onSelect={() => run(toggleCrt)} left="toggle CRT mode" />
              <PaletteItem value="copy email address" onSelect={() => run(copyEmail)} left="copy email" right={site.email} />
            </PaletteGroup>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}

function PaletteGroup({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <Command.Group
      heading={heading}
      className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.18em] [&_[cmdk-group-heading]]:text-faint"
    >
      {children}
    </Command.Group>
  );
}

function PaletteItem({
  value,
  onSelect,
  left,
  right,
  external,
}: {
  value: string;
  onSelect: () => void;
  left: React.ReactNode;
  right?: React.ReactNode;
  external?: boolean;
}) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="group flex cursor-pointer items-center justify-between gap-3 px-3 py-2 text-sm text-muted data-[selected=true]:bg-accent/10 data-[selected=true]:text-ink"
    >
      <span className="truncate">{left}</span>
      <span className="flex items-center gap-2 text-xs text-faint">
        {right && <span className="truncate">{right}</span>}
        {external ? (
          <ArrowUpRight size={13} className="opacity-0 group-data-[selected=true]:opacity-100" />
        ) : (
          <CornerDownLeft size={13} className="opacity-0 group-data-[selected=true]:opacity-100" />
        )}
      </span>
    </Command.Item>
  );
}
