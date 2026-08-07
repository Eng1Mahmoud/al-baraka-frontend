import type { Category } from "@/features/categories/types/category";

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  /** Populated by the API on list/detail endpoints. */
  category: Pick<Category, "_id" | "name" | "slug">;
  price: number;
  discountPrice?: number;
  unit: string;
  stock: number;
  images: string[];
  isAvailable: boolean;
  createdAt: string;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  pages: number;
  hasMore: boolean;
}

export type ProductSort = "newest" | "price-asc" | "price-desc" | "name";

export interface ProductFilters {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  availableOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSort;
}

/** One row on the home page: a category and the products to show under it. */
export interface HomeSection {
  category: Category;
  products: Product[];
}

export interface PriceBounds {
  min: number;
  max: number;
}
