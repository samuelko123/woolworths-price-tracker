import { type ResultAsync } from "neverthrow";

import { type Category } from "@/domain";

type LambdaResponse = {
  statusCode: number;
  body: string;
};

export type LambdaHandler = () => Promise<LambdaResponse>;

export type FetchCategories = () => ResultAsync<unknown, Error>;

export type ParseCategories = (data: unknown) => ResultAsync<Category[], Error>;

export type FilterCategories = (categories: Category[]) => ResultAsync<Category[], Error>;

export type GetCategoryQueueUrl = () => ResultAsync<string, Error>;

export type PurgeQueue = (queueUrl: string) => ResultAsync<void, Error>;

export type SendMessages = <T>(queueUrl: string, messages: T[]) => ResultAsync<void, Error>;
