"use client";

import { useState, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { DirectionProvider } from "@radix-ui/react-direction";
import { createQueryClient } from "@/shared/lib/queryClient";

export function Providers({ children }: { children: ReactNode }) {
  // One client per browser session; created in state so it survives re-renders
  // but is never shared between requests on the server.
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Tells Radix popovers, selects and menus which way to open. */}
      <DirectionProvider dir="rtl">{children}</DirectionProvider>
    </QueryClientProvider>
  );
}
