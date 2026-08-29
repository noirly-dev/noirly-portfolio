"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { Sun, Moon, Menu, X, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemePicker } from "@/components/ThemePicker";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { Magnetic } from "@/components/motion/Magnetic";
import { DURATION, EASE_OUT, EASE_IN_OUT, SPRING, stagger } from "@/lib/motion";
import { useInstantEntrance } from "@/hooks/useCoarsePointer";
import type { Profile } from "@/data/profile";

interface NavLink {
  label: string;
  href: string;
}

interface HeaderProps {
  title: string;
  navLinks: NavLink[];
  profile: Profile;
}

const SECTION_IDS = ["home", "about", "stack", "experience", "work", "contact"];

function hrefToSection(href: string): string | null {
  if (href === "/") return "home";
  return href.split("#")[1] ?? null;
}

const menuItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

export function Header({ title, navLinks, profile }: HeaderProps) {
  const brandName = title.replace(/\s*portfolio\s*/gi, "").trim();
  const pathname = usePathname();
  const instantEntrance = useInstantEntrance();
  const [activeSection, setActiveSection] = useState("home");
  const [isDark, setIsDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 16);
  });

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

  // Escape closes the menu — every overlay needs a keyboard escape route.
  useEffect(() => {
    if (!menuOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      try {
        localStorage.setItem("theme", next ? "dark" : "light");
      } catch {
        /* private mode — the class swap still applies for this session */
      }
      return next;
    });
  }, []);

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
    <>
      <motion.header
        initial={instantEntrance ? false : { y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: DURATION.slow, ease: EASE_OUT, delay: instantEntrance ? 0 : 0.1 }}
        className="sticky top-0 z-50"
      >
        {/* Material layer: invisible at rest, frosts in once the page moves. */}
        <motion.div
          aria-hidden
          className="absolute inset-0 border-b backdrop-blur-xl"
          animate={{
            opacity: scrolled ? 1 : 0,
            backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
          }}
          transition={{ duration: DURATION.base, ease: EASE_OUT }}
          style={{
            background: "color-mix(in srgb, var(--bg) 72%, transparent)",
            borderColor: "var(--hairline)",
          }}
        />

        <div className="shell relative flex h-[4.5rem] items-center justify-between gap-4 md:h-20">
          <Link
            href="/#home"
            aria-label={`${brandName} home`}
            className="group flex min-w-0 shrink-0 items-center gap-2.5 text-[var(--text)]"
            onClick={() => setMenuOpen(false)}
          >
            {/* Logo-only on small screens — brand name is visually hidden until sm. */}
            <span className="inline-flex size-[4.25rem] shrink-0 sm:hidden" aria-hidden>
              <Logo variant="nav" className="size-full" />
            </span>
            <span className="hidden items-center gap-3 font-display text-xl font-bold leading-none tracking-[-0.04em] uppercase sm:flex md:text-2xl lg:text-3xl">
              <span className="inline-flex size-14 shrink-0 md:size-16" aria-hidden>
                <Logo variant="nav" className="size-full" />
              </span>
              <span className="truncate" aria-hidden>
                {brandName}
              </span>
            </span>
          </Link>

          {/* Desktop nav — one shared-layout pill slides to the active section. */}
          <nav className="hidden lg:block" data-cursor="link">
            <ul className="flex items-center gap-1 rounded-full border border-[var(--hairline)] bg-[color-mix(in_srgb,var(--text)_4%,transparent)] p-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href} className="relative">
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className="relative block rounded-full px-3.5 py-2 font-mono text-xs font-semibold tracking-[0.14em] uppercase transition-colors duration-200"
                      style={{ color: active ? "var(--bg)" : "var(--text-muted)" }}
                    >
                      {active ? (
                        <span
                          aria-hidden
                          className="absolute inset-0 rounded-full bg-[var(--text)] transition-opacity duration-200"
                        />
                      ) : null}
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <ThemePicker />
            <motion.button
              type="button"
              onClick={toggleTheme}
              whileTap={{ scale: 0.9 }}
              transition={SPRING}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[var(--hairline)] text-[var(--text-secondary)] transition-colors hover:border-[var(--hairline-strong)] hover:text-[var(--text)]"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isDark ? "sun" : "moon"}
                  initial={{ y: 14, opacity: 0, rotate: -45 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -14, opacity: 0, rotate: 45 }}
                  transition={{ duration: DURATION.base, ease: EASE_OUT }}
                  className="absolute inline-flex"
                >
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            <Magnetic className="hidden lg:inline-flex">
              <Link href="/#contact" className="btn btn-solid" data-cursor="link">
                Get in touch
                <ArrowUpRight size={14} aria-hidden />
              </Link>
            </Magnetic>

            <motion.button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              whileTap={{ scale: 0.9 }}
              transition={SPRING}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[var(--hairline)] text-[var(--text)] lg:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={menuOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                  className="absolute inline-flex"
                >
                  {menuOpen ? <X size={18} /> : <Menu size={18} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        <ScrollProgress />
      </motion.header>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.base, ease: EASE_IN_OUT }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 backdrop-blur-2xl"
              style={{ background: "color-mix(in srgb, var(--bg) 92%, transparent)" }}
            />

            <motion.nav
              variants={stagger(0.05, 0.12)}
              initial="hidden"
              animate="show"
              className="relative flex h-full max-h-[100dvh] flex-col justify-center gap-1 overflow-y-auto overscroll-contain px-5 pb-[max(6rem,env(safe-area-inset-bottom))] pt-[max(5rem,env(safe-area-inset-top))] sm:px-7"
            >
              {navLinks.map((link, i) => (
                <motion.div key={link.href} variants={menuItem}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className="flex items-baseline gap-4 border-b border-[var(--hairline)] py-4"
                  >
                    <span className="mono-label w-6 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="display-lg"
                      style={{
                        color: isActive(link.href)
                          ? "var(--text)"
                          : "var(--text-muted)",
                      }}
                    >
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}

              <motion.a
                variants={menuItem}
                href={profile.contact.email.href}
                className="mono-label mt-8 inline-flex items-center gap-2 text-[var(--text-secondary)]"
              >
                {profile.contact.email.label}
                <ArrowUpRight size={13} aria-hidden />
              </motion.a>

              <motion.div variants={menuItem}>
                <ThemePicker variant="menu" onSelect={() => setMenuOpen(false)} />
              </motion.div>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
