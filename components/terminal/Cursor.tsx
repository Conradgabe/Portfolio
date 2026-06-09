import { cn } from "@/lib/utils";

/** The blinking phosphor cursor. Decorative — hidden from assistive tech. */
export function Cursor({ className }: { className?: string }) {
  return <span aria-hidden className={cn("cursor-blink", className)} />;
}
