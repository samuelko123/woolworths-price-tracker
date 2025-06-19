import { Category, Product } from "@/domain";

type DequeueResult = {
  category: Category;
  acknowledge: () => Promise<void>;
};

export type DequeueCategory = () => Promise<DequeueResult | null>;

export type FetchProductsByCategory = (category: Category) => Promise<Product[]>;

export type SaveProduct = (product: Product) => Promise<void>;
