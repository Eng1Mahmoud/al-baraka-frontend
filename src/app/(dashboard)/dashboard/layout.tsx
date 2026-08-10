import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    /*
      Exactly the viewport, not at least it. Under `min-h-dvh` a long orders table grew
      the shell, and the sidebar — a stretched flex item — grew with it into a metres-tall
      green column whose nav had scrolled off the top. Pinning the shell and moving the
      scrolling into <main> keeps the nav and header where they were put.
    */
    <div className="flex h-dvh overflow-hidden">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader />

        {/*
          The scroll container. `min-h-0` is what makes that work: a flex item's
          automatic minimum size is its content, so without it <main> would refuse to
          shrink under a tall table and would push the shell open instead of scrolling.

          Also a flex column, so a panel that wants the leftover height — the loader,
          an empty state — can ask for it with `flex-1` rather than guessing the
          header's height in a calc().
        */}
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-muted/40">
          {/* Centred and width-capped so content doesn't stretch across wide screens. */}
          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
