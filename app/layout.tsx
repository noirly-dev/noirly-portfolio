import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { ThemeStyles } from "@/components/ThemeStyles";
import { getPortfolioContent } from "@/lib/content/server";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.aneesh-pissay.in"),
  title: "Noirly Portfolio · Aneesh Pissay",
  description:
    "Aneesh Pissay — full stack and mobile developer. Personal portfolio in the Noirly product family.",
  icons: {
    icon: [
      {
        url: "/logo.svg",
        type: "image/svg+xml",
      },
    ],
  },
  openGraph: {
    title: "Noirly Portfolio · Aneesh Pissay",
    description:
      "Aneesh Pissay — full stack and mobile developer. Personal portfolio in the Noirly product family.",
    url: "https://www.aneesh-pissay.in",
    siteName: "Noirly Portfolio",
    images: [
      {
        url: "/logo.svg",
        width: 384,
        height: 396,
        alt: "Noirly Portfolio",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Noirly Portfolio · Aneesh Pissay",
    description:
      "Aneesh Pissay — full stack and mobile developer. Personal portfolio in the Noirly product family.",
    images: ["/logo.svg"],
  },
};

const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Stack", href: "/#stack" },
  { label: "Experience", href: "/#experience" },
  { label: "Work", href: "/#work" },
  { label: "Contact", href: "/#contact" },
];

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
      name: "Aneesh Pissay",
      url: "https://www.aneesh-pissay.in/",
      image: "https://www.aneesh-pissay.in/logo.svg",
    },
    {
      "@type": "Organization",
      name: "Noirly Portfolio",
      url: "https://www.aneesh-pissay.in/",
      logo: "https://www.aneesh-pissay.in/logo.svg",
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getPortfolioContent();

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
            if (t === 'light') document.documentElement.classList.remove('dark');
            else document.documentElement.classList.add('dark');
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
        <MotionProvider>
          <Header title="Noirly Portfolio" navLinks={navLinks} />
          {children}
          <Footer title="Noirly Portfolio" />
        </MotionProvider>
      </body>
    </html>
  );
}
