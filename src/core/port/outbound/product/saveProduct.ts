import { Product } from "@/domain";

export type SaveProduct = (product: Product) => Promise<void>;
