import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WeDraft",
  description: "微信公众号订阅号草稿箱发布台"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
