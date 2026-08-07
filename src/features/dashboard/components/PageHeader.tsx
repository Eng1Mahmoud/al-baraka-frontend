import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Right-hand action, e.g. an "add" button. */
  action?: ReactNode;
  /** Match the content width below it so the title lines up with the content. */
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn("mx-auto mb-6 flex w-full flex-wrap items-center justify-between gap-3", className)}>
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
