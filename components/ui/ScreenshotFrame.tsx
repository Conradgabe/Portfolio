import Image from "next/image";
import type { ProjectImage } from "@/lib/site";
import { cn } from "@/lib/utils";

/** A real product screenshot inside an on-brand terminal/browser window frame. */
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
  return (
    <figure className={cn("overflow-hidden border border-line bg-surface", className)}>
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
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
        priority={priority}
        sizes={sizes}
        className="h-auto w-full"
      />
    </figure>
  );
}
