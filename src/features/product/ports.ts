import { type Result } from "@/core/result";
import { type AcknowledgeFn } from "@/core/sqs";
import { type Category, type Product } from "@/domain";

type LambdaResponse = {
  statusCode: number;
  body: string;
};

export type LambdaHandler = () => Promise<LambdaResponse>;

export type DequeueResult = {
  category: Category;
  acknowledge: AcknowledgeFn;
};

export type DequeueCategory = () => Promise<Result<DequeueResult>>;

export type FetchProductsByCategory = (category: Category) => Promise<Product[]>;

export type SaveProduct = (product: Product) => Promise<void>;
