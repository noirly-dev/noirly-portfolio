import type { Metadata } from "next";
import { Hanken_Grotesk, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.aneesh-pissay.in"),
  title: "Noirly Portfolio · Aneesh Pissay",
  description:
    "Aneesh Pissay — full stack and mobile developer. Personal portfolio in the Noirly product family.",
  icons: {
    icon: [
      {
        url: "/logo-dark.png",
        type: "image/png",
        sizes: "2048x2048",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/logo-light.png",
        type: "image/png",
        sizes: "2048x2048",
        media: "(prefers-color-scheme: light)",
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
        url: "/logo-dark.png",
        width: 2048,
        height: 2048,
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
    images: ["/logo-dark.png"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
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
        className={`${spaceGrotesk.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable} flex min-h-dvh flex-col antialiased`}
      >
        <Header title="Noirly Portfolio" navLinks={navLinks} />
        {children}
        <Footer title="Noirly Portfolio" />
      </body>
    </html>
  );
}
