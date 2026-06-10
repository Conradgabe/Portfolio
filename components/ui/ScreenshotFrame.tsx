"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { ProjectImage } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * A real product screenshot inside an on-brand terminal/browser window frame.
 * Click to open a full-resolution lightbox (these screenshots are dense, so
 * zoom matters). Esc or a backdrop click closes it.
 */
export function ScreenshotFrame({
  image,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 880px",
}: {
  image: ProjectImage;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <figure className={cn("group overflow-hidden border border-line bg-surface", className)}>
        <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
          <span className="h-2 w-2 rounded-full border border-line-strong" />
          <span className="h-2 w-2 rounded-full border border-line-strong" />
          <span className="h-2 w-2 rounded-full border border-line-strong" />
          {image.label && (
            <span className="ml-2 truncate font-mono text-[10px] text-faint">{image.label}</span>
          )}
          <span className="ml-auto hidden shrink-0 font-mono text-[10px] text-faint opacity-0 transition-opacity group-hover:opacity-100 sm:inline">
            click to enlarge
          </span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Enlarge screenshot: ${image.alt}`}
          className="block w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-ink"
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={image.w}
            height={image.h}
            priority={priority}
            sizes={sizes}
            className="h-auto w-full"
          />
        </button>
      </figure>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={image.alt}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close enlarged screenshot"
            autoFocus
            className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center border border-line-strong bg-surface text-muted transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-ink"
          >
            <X size={18} />
          </button>
          <figure
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-6xl cursor-default overflow-auto border border-line-strong bg-surface"
          >
            <div className="sticky top-0 flex items-center gap-1.5 border-b border-line bg-surface px-3 py-2">
              <span className="h-2 w-2 rounded-full border border-line-strong" />
              <span className="h-2 w-2 rounded-full border border-line-strong" />
              <span className="h-2 w-2 rounded-full border border-line-strong" />
              {image.label && (
                <span className="ml-2 truncate font-mono text-[10px] text-faint">{image.label}</span>
              )}
            </div>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.w}
              height={image.h}
              sizes="100vw"
              className="h-auto w-full"
            />
          </figure>
        </div>
      )}
    </>
  );
}
