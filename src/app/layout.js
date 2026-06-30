import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import TransitionProvider from "./components/TransitionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MC Dev — Mateus Celestino",
  description: "Desenvolvedor Full Stack — sites, sistemas e experiências web.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col select-none">
        <TransitionProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </TransitionProvider>
      </body>
    </html>
  );
}