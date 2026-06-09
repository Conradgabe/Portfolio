import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { Space_Grotesk } from "next/font/google";
import { site } from "@/lib/site";
import { Nav } from "@/components/ui/Nav";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { Footer } from "@/components/ui/Footer";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gabriel-isuekebho.vercel.app"),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.metaDescription,
  authors: [{ name: site.name }],
  creator: site.name,
  keywords: [
    "Gabriel Isuekebho",
    "backend engineer",
    "systems engineer",
    "Bitcoin",
    "Lightning Network",
    "AI engineer",
    "FastAPI",
    "Lagos",
  ],
  openGraph: {
    type: "website",
    title: `${site.name} — ${site.role}`,
    description: site.metaDescription,
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.metaDescription,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0b0b" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark light",
};

// Set the theme before paint to avoid a flash.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t='dark';}document.documentElement.dataset.theme=t;if(localStorage.getItem('crt')==='on'){document.documentElement.dataset.crt='on';}}catch(e){document.documentElement.dataset.theme='dark';}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${GeistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Nav />
        <CommandPalette />
        {children}
        <Footer />
      </body>
    </html>
  );
}
