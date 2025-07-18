import { type ResultAsync } from "neverthrow";

import { type Category } from "@/features/category";
import { type SqsMessage } from "@/gateways/sqs";

import { type Product } from "../../domain/product";

export type ReceiveCategoryMessage = () => ResultAsync<SqsMessage, Error>;

export type FetchProducts = (category: Category) => ResultAsync<unknown[], Error>;

export type SaveProducts = (products: Product[]) => ResultAsync<void, Error>;

export type DeleteMessage = (message: SqsMessage) => ResultAsync<void, Error>;
