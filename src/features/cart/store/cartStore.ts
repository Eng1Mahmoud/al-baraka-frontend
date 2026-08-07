"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/features/products/types/product";
import type { ValidatedCartItem } from "@/features/cart/types/cart";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  unit: string;
  image?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  add: (product: Product, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  reconcile: (checked: ValidatedCartItem[]) => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
}

/**
 * Guest cart, kept in localStorage. Prices here are for display only — the API
 * recalculates every total from the database when the order is placed.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.productId === product._id);

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === product._id ? { ...item, quantity: item.quantity + quantity } : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                productId: product._id,
                name: product.name,
                price: product.discountPrice ?? product.price,
                unit: product.unit,
                image: product.images[0],
                quantity,
              },
            ],
          };
        }),

      setQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity < 1
              ? state.items.filter((item) => item.productId !== productId)
              : state.items.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
        })),

      remove: (productId) =>
        set((state) => ({ items: state.items.filter((item) => item.productId !== productId) })),

      /**
       * Brings a cart that has been sitting in localStorage back in line with what
       * the shop currently has: drops what is gone or switched off, and lowers any
       * quantity to what's left on the shelf. Prices are refreshed at the same time,
       * so nothing stored here still quotes last week's number.
       *
       * Deliberately not run on load. A cart that quietly loses items between visits
       * is worse than one that says what changed — this is wired to a button the
       * customer presses, having been told what it will do.
       *
       * Lines missing from the response are left untouched rather than guessed at.
       */
      reconcile: (checked) =>
        set((state) => ({
          items: state.items.flatMap((item) => {
            const line = checked.find((candidate) => candidate.productId === item.productId);
            if (!line) return [item];

            const stock = line.stock ?? 0;
            if (line.removed || line.isAvailable === false || stock < 1) return [];

            return [
              {
                ...item,
                price: line.price ?? item.price,
                quantity: Math.min(item.quantity, stock),
              },
            ];
          }),
        })),

      clear: () => set({ items: [] }),

      subtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      count: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: "al-baraka-cart" }
  )
);
