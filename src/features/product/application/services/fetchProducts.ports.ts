import { type ResultAsync } from "neverthrow";

import { type Category } from "@/features/category";

export type FetchProductPage = (category: Category, pageNumber: number) => ResultAsync<unknown, Error>;
