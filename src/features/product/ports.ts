import { type ResultAsync } from "@/core/result";
import { type SqsMessage } from "@/core/sqs";
import { type Category, type Product } from "@/domain";

type LambdaResponse = {
  statusCode: number;
  body: string;
};

export type LambdaHandler = () => Promise<LambdaResponse>;

export type GetCategoryQueueUrl = () => ResultAsync<string>;

export type ReceiveMessage = (queueUrl: string) => ResultAsync<SqsMessage>;

export type ParseCategory = (message: SqsMessage) => ResultAsync<Category>;

export type FetchProducts = (category: Category) => ResultAsync<Product[]>;

export type SaveProducts = (products: Product[]) => ResultAsync<void>;

export type AcknowledgeMessage = (message: SqsMessage) => ResultAsync<void>;
