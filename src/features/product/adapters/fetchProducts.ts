import { logInfo } from "@/core/logger";
import { fetchAllPages } from "@/core/pagination";
import { randomDelay } from "@/core/timing";
import { createApiClient, fetchCategoryPage } from "@/integrations/woolworths";

import { type FetchProducts } from "../ports";

export const fetchProducts: FetchProducts = (category) => {
  logInfo("Fetching products...", { category: category.urlName });

  return createApiClient()
    .andThen((client) =>
      fetchAllPages({
        fetchPage: (pageNumber) => fetchCategoryPage(client, category, pageNumber),
        delay: () => randomDelay({ min: 1000, max: 2000 }),
      }),
    )
    .andTee((products) => {
      logInfo("Fetched products", {
        category: category.urlName,
        productCount: products.length,
      });
    });
};
