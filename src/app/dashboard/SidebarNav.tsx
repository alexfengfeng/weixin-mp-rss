"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Award, FileText, Home, ListChecks, Palette, PenLine, Send, Sparkles, Type } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "概览", icon: Home },
  { href: "/dashboard/ai", label: "AI 工作台", icon: Sparkles },
  { href: "/dashboard/mps", label: "订阅号", icon: Send },
  { href: "/dashboard/articles", label: "文章", icon: FileText },
  { href: "/dashboard/drafts", label: "草稿", icon: PenLine },
  { href: "/dashboard/writing-styles", label: "写作风格", icon: Type },
  { href: "/dashboard/wechat-styles", label: "排版模板", icon: Palette },
  { href: "/dashboard/brand", label: "品牌档案", icon: Award },
  { href: "/dashboard/jobs", label: "任务", icon: ListChecks }
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav>
      {links.map((item) => {
        const Icon = item.icon;
        const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} className={cn(active && "active")}>
            <span className="nav-icon"><Icon size={15} /></span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
