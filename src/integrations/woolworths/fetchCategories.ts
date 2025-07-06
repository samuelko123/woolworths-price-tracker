import { ResultAsync } from "neverthrow";

import { toError } from "@/core/error";
import { logInfo } from "@/core/logger";
import { parseWithSchema } from "@/core/validation";
import { type Category } from "@/features/category";

import { createApiClient } from "./createApiClient";
import { WoolworthsCategoriesResponseSchema } from "./fetchCategories.schema";

export const fetchCategories = (): ResultAsync<Category[], Error> => {
  logInfo("Fetching categories...");

  return createApiClient()
    .andThen((client) => ResultAsync.fromPromise(client.get("/apis/ui/PiesCategoriesWithSpecials"), toError))
    .andThen((res) => parseWithSchema(WoolworthsCategoriesResponseSchema, res.data));
};
