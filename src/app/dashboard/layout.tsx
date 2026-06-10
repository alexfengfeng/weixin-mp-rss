import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { SidebarNav } from "./SidebarNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="shell">
      <aside className="sidebar">
        <h2>WeDraft</h2>
        <p className="muted">{user.username}</p>
        <SidebarNav />
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
