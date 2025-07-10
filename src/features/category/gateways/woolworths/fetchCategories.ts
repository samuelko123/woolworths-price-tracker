import { okAsync, ResultAsync } from "neverthrow";

import { toError } from "@/core/error";
import { createApiClient } from "@/gateways/woolworths";

import { type FetchCategories } from "../../application/use-cases/importCategories.ports";

export const fetchCategories: FetchCategories = (): ResultAsync<unknown, Error> => {
  return createApiClient()
    .andThen((client) => ResultAsync.fromPromise(client.get("/apis/ui/PiesCategoriesWithSpecials"), toError))
    .andThen((res) => okAsync(res.data));
};
