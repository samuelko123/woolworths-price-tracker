import { type ResultAsync } from "neverthrow";

import { type Category } from "../../domain/category";

export type FetchCategories = () => ResultAsync<unknown, Error>;

export type GetCategoryQueueUrl = () => ResultAsync<string, Error>;

export type PurgeQueue = (queueUrl: string) => ResultAsync<void, Error>;

export type SendCategoryMessages = (categories: Category[]) => ResultAsync<void, Error>;
