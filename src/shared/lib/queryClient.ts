import { QueryClient } from "@tanstack/react-query";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

/** Every query key in the app starts here, so invalidation stays predictable. */
export const queryKeys = {
  categories: ["categories"] as const,
  category: (id: string) => ["categories", id] as const,
  products: (filters?: object) => ["products", filters ?? {}] as const,
  product: (id: string) => ["products", id] as const,
  orders: (filters?: object) => ["orders", filters ?? {}] as const,
  order: (id: string) => ["orders", id] as const,
  orderStats: ["orders", "stats"] as const,
  /** Prefix — the full key also carries the lines and the chosen area. */
  cartValidation: ["cart", "validate"] as const,
  admins: ["admins"] as const,
  settings: ["settings"] as const,
  me: ["auth", "me"] as const,
};
