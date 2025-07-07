import { okAsync, ResultAsync } from "neverthrow";

import { toError } from "@/core/error";
import { type FetchCategories } from "@/features/category";

import { createApiClient } from "./createApiClient";

export const fetchCategories: FetchCategories = (): ResultAsync<unknown, Error> => {
  return createApiClient()
    .andThen((client) => ResultAsync.fromPromise(client.get("/apis/ui/PiesCategoriesWithSpecials"), toError))
    .andThen((res) => okAsync(res.data));
};
