import type { Metadata } from "next";
import { Rubik, Vollkorn } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const vollkorn = Vollkorn({
  subsets: ["latin"],
  variable: "--font-story",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LinguaQuest — Learn Languages Through Adventure",
  description:
    "An immersive language-learning RPG where you explore cities through audio and dialogue with local NPCs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${rubik.variable} ${vollkorn.variable}`}>
      <body className="min-h-dvh" style={{ background: "oklch(0.09 0.008 75)" }}>
        <main className="mx-auto max-w-[480px] min-h-dvh relative overflow-hidden"
              style={{ background: "oklch(0.12 0.008 75)" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
