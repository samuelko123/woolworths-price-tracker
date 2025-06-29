import { type ResultAsync } from "neverthrow";

import { type SqsMessage } from "@/core/sqs";
import { type Category, type Product } from "@/domain";

type LambdaResponse = {
  statusCode: number;
  body: string;
};

export type LambdaHandler = () => Promise<LambdaResponse>;

export type GetCategoryQueueUrl = () => ResultAsync<string, Error>;

export type ReceiveMessage = (queueUrl: string) => ResultAsync<SqsMessage, Error>;

export type ParseCategory = (message: SqsMessage) => ResultAsync<Category, Error>;

export type FetchProducts = (category: Category) => ResultAsync<Product[]>;

export type SaveProducts = (products: Product[]) => ResultAsync<void>;

export type DeleteMessage = (message: SqsMessage) => ResultAsync<void>;
