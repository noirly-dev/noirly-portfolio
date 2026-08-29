import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { ThemeStyles } from "@/components/ThemeStyles";
import { SiteBackground } from "@/components/SiteBackground";
import { FaviconTheme } from "@/components/FaviconTheme";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CustomCursor } from "@/components/CustomCursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { PageTransition } from "@/components/PageTransition";
import { getPortfolioContent } from "@/lib/content/server";
import { THEME_IDS } from "@/lib/themes/index";
import "./globals.css";
import "lenis/dist/lenis.css";
import "@/styles/cursor.css";
import "@/styles/transitions.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Stack", href: "/#stack" },
  { label: "Experience", href: "/#experience" },
  { label: "Work", href: "/#work" },
  { label: "Contact", href: "/#contact" },
];

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPortfolioContent();
  const { profile } = content;
  const title = `Noirly Portfolio · ${profile.name}`;

  return {
    metadataBase: new URL("https://www.aneesh-pissay.in"),
    title,
    description: profile.description,
    icons: {
      icon: [
        {
          url: "/favicon-light-48.png",
          type: "image/png",
          sizes: "48x48",
          media: "(prefers-color-scheme: light)",
        },
        {
          url: "/favicon-dark-48.png",
          type: "image/png",
          sizes: "48x48",
          media: "(prefers-color-scheme: dark)",
        },
        {
          url: "/favicon-light-192.png",
          type: "image/png",
          sizes: "192x192",
          media: "(prefers-color-scheme: light)",
        },
        {
          url: "/favicon-dark-192.png",
          type: "image/png",
          sizes: "192x192",
          media: "(prefers-color-scheme: dark)",
        },
      ],
      apple: [
        {
          url: "/apple-icon.png",
          type: "image/png",
          sizes: "180x180",
        },
      ],
    },
    openGraph: {
      title,
      description: profile.description,
      url: "https://www.aneesh-pissay.in",
      siteName: "Noirly Portfolio",
      images: [
        {
          url: "/favicon-light-192.png",
          width: 192,
          height: 192,
          alt: "Noirly Portfolio",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description: profile.description,
      images: ["/favicon-light-192.png"],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getPortfolioContent();
  const { profile } = content;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "Noirly Portfolio",
        url: "https://www.aneesh-pissay.in/",
      },
      {
        "@type": "Person",
        name: profile.name,
        url: "https://www.aneesh-pissay.in/",
        image: "https://www.aneesh-pissay.in/favicon-light-192.png",
      },
      {
        "@type": "Organization",
        name: "Noirly Portfolio",
        url: "https://www.aneesh-pissay.in/",
        logo: "https://www.aneesh-pissay.in/favicon-light-192.png",
      },
    ],
  };

  return (
    <html lang="en" className="dark" suppressHydrationWarning data-theme={content.theme.id}>
      <head>
        <ThemeStyles themeId={content.theme.id} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          try {
            var t = localStorage.getItem('theme');
            var isDark = t !== 'light';
            if (isDark) document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
            var validPalettes = ${JSON.stringify(THEME_IDS)};
            var defaultPalette = ${JSON.stringify(content.theme.id)};
            var palette = localStorage.getItem('palette');
            if (!palette || validPalettes.indexOf(palette) === -1) palette = defaultPalette;
            document.documentElement.dataset.theme = palette;
            var favicon = document.createElement('link');
            favicon.rel = 'icon';
            favicon.type = 'image/png';
            favicon.sizes = '48x48';
            favicon.dataset.themeSync = 'true';
            favicon.href = isDark ? '/favicon-dark-48.png' : '/favicon-light-48.png';
            document.head.appendChild(favicon);
          } catch(e) {}
        `,
          }}
        />
      </head>
      <body
        className={`${fraunces.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable} flex min-h-dvh flex-col antialiased`}
      >
        {/*
          Framer Motion serialises each element's `initial` state into the SSR
          HTML (e.g. style="opacity:0"), so with JavaScript disabled the page
          would render blank. Neutralise those inline states for no-JS readers
          and crawlers that don't execute scripts.
        */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html: `[style*="opacity:0"],[style*="translateY(110%)"],[style*="scale(0)"],[style*="scaleX(0)"],[style*="scaleY(0)"]{opacity:1!important;filter:none!important;transform:none!important}`,
            }}
          />
        </noscript>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {/*
          <SmoothScroll> is outermost of the behavioural providers: it owns the
          document scroller, and everything below reads scroll position from it
          (directly, or through Framer Motion's useScroll). It renders no
          element of its own, so it cannot affect layout.
        */}
        <SmoothScroll>
          <SiteBackground />
          {/*
            Renders null on the server and on coarse pointers — <CustomCursor>
            gates on a `useSyncExternalStore` whose server snapshot is false, so
            nothing for it reaches the SSR HTML. (`next/dynamic` with
            `ssr: false` is not permitted inside a Server Component, and both
            elements are position: fixed, so there is nothing to shift either
            way.)
          */}
          <CustomCursor />
          <FaviconTheme />
          <ThemeProvider defaultThemeId={content.theme.id}>
            <MotionProvider>
              <Header title="Noirly Portfolio" navLinks={navLinks} profile={profile} />
              {/*
                Only {children} is wrapped: the header and footer persist across
                routes, and the shutter is fixed, so it covers them regardless.
              */}
              <PageTransition>{children}</PageTransition>
              <Footer title="Noirly Portfolio" profile={profile} />
            </MotionProvider>
          </ThemeProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
