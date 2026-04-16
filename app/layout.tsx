import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="min-h-dvh bg-[#0A0A0A]">
        <main className="mx-auto max-w-[480px] min-h-dvh bg-[#0F0F0F] relative overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
