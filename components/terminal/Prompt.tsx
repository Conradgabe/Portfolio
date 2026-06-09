import { cn } from "@/lib/utils";

/**
 * A shell prompt line: `gabriel@portfolio:~$ <command>`.
 * Purely presentational; colors come from the phosphor token system.
 */
export function Prompt({
  path = "~",
  children,
  className,
  dim = false,
}: {
  path?: string;
  children?: React.ReactNode;
  className?: string;
  dim?: boolean;
}) {
  return (
    <span className={cn("font-mono whitespace-pre-wrap break-words", className)}>
      <span className={cn(dim ? "text-faint" : "text-accent-ink")}>gabriel</span>
      <span className="text-faint">@</span>
      <span className={cn(dim ? "text-faint" : "text-accent-ink")}>portfolio</span>
      <span className="text-faint">:{path}</span>
      <span className="text-muted">$ </span>
      <span className="text-ink">{children}</span>
    </span>
  );
}
