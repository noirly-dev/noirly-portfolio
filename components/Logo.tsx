import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  title?: string;
  /** Crops outer hex padding so the mark reads clearly at nav sizes */
  variant?: "default" | "nav";
};

/** Renders `/logo.svg` — dark mark in light mode, white in dark mode. */
export function Logo({ className, title, variant = "default" }: LogoProps) {
  return (
    <span
      className={cn("logo-mark", variant === "nav" && "logo-mark-nav", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <img src="/logo.svg" alt="" className="logo-mark-img" decoding="async" />
    </span>
  );
}
