import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}

/**
 * Minimal monospace code block. No syntax highlighting — just a subtle
 * gray panel with a thin border, optional file/title header, and
 * comfortable padding. Keeps the design strictly B&W.
 */
export function CodeBlock({ code, language, title, className }: CodeBlockProps) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-secondary",
        className,
      )}
    >
      {(title || language) && (
        <figcaption className="flex items-center justify-between gap-3 border-b border-border bg-background px-4 py-2">
          {title && (
            <span className="text-xs font-medium tracking-tight text-foreground">
              {title}
            </span>
          )}
          {language && (
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {language}
            </span>
          )}
        </figcaption>
      )}
      <pre className="overflow-x-auto px-4 py-4">
        <code className="block whitespace-pre font-mono text-[13px] leading-relaxed text-foreground">
          {code}
        </code>
      </pre>
    </figure>
  );
}
