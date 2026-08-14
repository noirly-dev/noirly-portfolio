import Link from "next/link";
import { profile } from "@/data/profile";

interface FooterProps {
  title: string;
}

const footerLinks = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Stack", href: "/#stack" },
  { label: "Experience", href: "/#experience" },
  { label: "Work", href: "/#work" },
  { label: "Contact", href: "/#contact" },
];

export function Footer({ title }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-dashed border-[var(--hairline)]">
      <div className="section-inner py-12 md:py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <p className="font-display text-lg font-bold tracking-[-0.04em] uppercase">
              {title}
            </p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {profile.name} · {profile.role}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--text-muted)]">
              Personal portfolio for selected work across web, mobile, and the
              Noirly product family.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="font-mono text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--text-muted)]">
              On this page
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-4">
            <p className="font-mono text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--text-muted)]">
              Connect
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <a
                href={profile.contact.email.href}
                className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
              >
                {profile.contact.email.label}
              </a>
              <a
                href={profile.contact.linkedin.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
              >
                LinkedIn
              </a>
              <a
                href={profile.contact.github.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-[var(--hairline)] pt-6 font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--text-muted)]">
          <span>
            © {currentYear} {profile.name}
          </span>
          <span>Noirly design system</span>
        </div>
      </div>
    </footer>
  );
}
