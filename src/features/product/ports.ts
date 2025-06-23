import { type Result } from "@/core/result";
import { type Category, type Product } from "@/domain";

type LambdaResponse = {
  statusCode: number;
  body: string;
};

export type LambdaHandler = () => Promise<LambdaResponse>;

type DequeueResult = {
  category: Category;
  acknowledge: () => Promise<void>;
};

export type DequeueCategory = () => Promise<Result<DequeueResult>>;

export type FetchProductsByCategory = (category: Category) => Promise<Product[]>;

export type SaveProduct = (product: Product) => Promise<void>;
