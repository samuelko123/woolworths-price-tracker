import { type ResultAsync } from "neverthrow";

import { type Category } from "../../domain/category";

export type PurgeCategoryQueue = () => ResultAsync<void, Error>;

export type FetchCategories = () => ResultAsync<unknown, Error>;

export type SendCategoryMessages = (categories: Category[]) => ResultAsync<void, Error>;
