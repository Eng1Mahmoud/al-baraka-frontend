import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <div className="flex min-h-dvh">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader />

        {/* A flex column, not a plain block: it passes the leftover height down, so a
            panel that wants to fill it — the loader, an empty state — can ask for it
            with `flex-1` instead of guessing the header's height in a calc(). */}
        <main className="flex flex-1 flex-col bg-muted/40">
          {/* Centred and width-capped so content doesn't stretch across wide screens. */}
          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
