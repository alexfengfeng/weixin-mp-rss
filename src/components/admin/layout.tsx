import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
  meta
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <div className="page-header">
      <div className="page-title-block">
        <h1>{title}</h1>
        {description ? <p className="page-description">{description}</p> : null}
      </div>
      <div className="page-header-side">
        {meta}
        {actions}
      </div>
    </div>
  );
}

export function CompactPanel({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={cn("compact-panel", className)}>{children}</section>;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="empty-state">{children}</div>;
}

export function MetaText({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("meta-text", className)}>{children}</span>;
}

export function Truncate({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("truncate", className)}>{children}</span>;
}
