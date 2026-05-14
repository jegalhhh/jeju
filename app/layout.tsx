import type { Metadata } from "next";
import {
  Noto_Serif_KR,
  Gowun_Dodum,
  Nanum_Pen_Script,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const notoSerifKR = Noto_Serif_KR({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const gowunDodum = Gowun_Dodum({
  variable: "--font-gowun",
  subsets: ["latin"],
  weight: "400",
});

const nanumPenScript = Nanum_Pen_Script({
  variable: "--font-nanum-pen",
  subsets: ["latin"],
  weight: "400",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "느린 소식",
  description: "제주에서 띄운 소식",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${notoSerifKR.variable} ${gowunDodum.variable} ${nanumPenScript.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
