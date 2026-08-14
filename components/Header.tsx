"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
}

interface HeaderProps {
  title: string;
  navLinks: NavLink[];
}

const SECTION_IDS = ["home", "about", "stack", "experience", "work", "contact"];

function hrefToSection(href: string): string | null {
  if (href === "/") return "home";
  return href.split("#")[1] ?? null;
}

export function Header({ title, navLinks }: HeaderProps) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("home");
  const [isDark, setIsDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  useEffect(() => {
    if (pathname !== "/") return;
    const intersecting = new Set<string>();
    const observers = SECTION_IDS.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) intersecting.add(id);
          else intersecting.delete(id);
          setActiveSection(SECTION_IDS.find((s) => intersecting.has(s)) ?? "home");
        },
        { rootMargin: "-22% 0px -45% 0px" },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [pathname]);

  function isActive(href: string): boolean {
    if (pathname !== "/") return pathname === href;
    return hrefToSection(href) === activeSection;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-dashed border-[var(--hairline)] bg-[color-mix(in_srgb,var(--bg)_92%,transparent)] backdrop-blur-md">
      <div className="section-inner flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <Link
          href="/#home"
          className="min-w-0 shrink-0"
          onClick={() => setMenuOpen(false)}
        >
          <span className="block font-display text-base font-bold tracking-[-0.04em] uppercase md:text-lg">
            {title}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative py-2 font-mono text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors ${
                isActive(link.href)
                  ? "text-[var(--text)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {link.label}
              {isActive(link.href) ? (
                <span className="absolute inset-x-0 -bottom-0.5 h-px bg-[var(--text)]" />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-9 w-9 items-center justify-center border border-dashed border-[var(--hairline)] text-[var(--text-muted)] transition-colors hover:bg-[var(--text)] hover:text-[var(--bg)]"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center border border-dashed border-[var(--hairline)] lg:hidden"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 top-16 z-40 bg-black/55 lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <nav className="absolute inset-x-0 top-full z-50 border-b border-dashed border-[var(--hairline)] bg-[var(--bg)] px-5 py-2 lg:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block border-b border-dashed border-[var(--hairline)] py-3.5 font-mono text-[12px] font-semibold tracking-[0.16em] uppercase last:border-b-0 ${
                  isActive(link.href) ? "text-[var(--text)]" : "text-[var(--text-muted)]"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </>
      ) : null}
    </header>
  );
}
