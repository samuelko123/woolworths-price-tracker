import { type ResultAsync } from "@/core/result";
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

export type DequeueCategory = () => ResultAsync<DequeueResult>;

export type FetchProducts = (category: Category) => ResultAsync<Product[]>;

export type SaveProduct = (product: Product) => ResultAsync<unknown>;
