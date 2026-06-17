import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ミヤタアスリートクラブ｜コザ運動公園 陸上競技場の陸上教室",
  description:
    "沖縄・コザ運動公園 陸上競技場の陸上教室。小学生から一般まで、年齢・成長に合わせた3コース・少人数指導。体験・見学は無料です。",
  openGraph: {
    title: "ミヤタアスリートクラブ｜陸上教室",
    description:
      "沖縄の青空の下で、走る・跳ぶの基礎から楽しく。体験・見学は無料。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700;900&family=Zen+Kaku+Gothic+New:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
