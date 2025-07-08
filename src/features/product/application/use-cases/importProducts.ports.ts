import { type ResultAsync } from "neverthrow";

import { type SqsMessage } from "@/core/sqs";
import { type Category } from "@/features/category";

import { type Product } from "../../domain/product";

export type GetCategoryQueueUrl = () => ResultAsync<string, Error>;

export type ReceiveMessage = (queueUrl: string) => ResultAsync<SqsMessage, Error>;

export type FetchProducts = (category: Category) => ResultAsync<unknown[], Error>;

export type SaveProducts = (products: Product[]) => ResultAsync<void, Error>;

export type DeleteMessage = (message: SqsMessage) => ResultAsync<void, Error>;
