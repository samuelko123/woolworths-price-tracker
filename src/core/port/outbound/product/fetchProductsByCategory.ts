import { Category, Product } from "@/domain";

export type FetchProductsByCategory = (category: Category) => Promise<Product[]>;
