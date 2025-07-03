import { type ResultAsync } from "neverthrow";

import { type SqsMessage } from "@/core/sqs";
import { type Product } from "@/domain";
import { type Category } from "@/features/category";
import { type WoolworthsProduct } from "@/integrations/woolworths";

type LambdaResponse = {
  statusCode: number;
  body: string;
};

type RawProduct = WoolworthsProduct;

export type LambdaHandler = () => Promise<LambdaResponse>;

export type GetCategoryQueueUrl = () => ResultAsync<string, Error>;

export type ReceiveMessage = (queueUrl: string) => ResultAsync<SqsMessage, Error>;

export type ParseCategory = (message: SqsMessage) => ResultAsync<Category, Error>;

export type FetchProducts = (category: Category) => ResultAsync<RawProduct[], Error>;

export type ParseProducts = (items: RawProduct[]) => ResultAsync<Product[], Error>;

export type SaveProducts = (products: Product[]) => ResultAsync<void, Error>;

export type DeleteMessage = (message: SqsMessage) => ResultAsync<void, Error>;
