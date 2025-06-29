import { ResultAsync } from "neverthrow";

import { toError } from "@/core/error";
import { logInfo } from "@/core/logger";
import { createApiClient } from "@/integrations/woolworths";

import { type FetchCategories } from "../ports";

export const fetchCategories: FetchCategories = () => {
  logInfo("Fetching categories...");

  return createApiClient()
    .andThen((client) => ResultAsync.fromPromise(client.get("/apis/ui/PiesCategoriesWithSpecials"), toError));
};
