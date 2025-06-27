import { logInfo } from "@/core/logger";
import { fetchAllPages } from "@/core/pagination";
import { randomDelay } from "@/core/timing";
import { createApiClient, fetchCategoryPage } from "@/integrations/woolworths";

import { type FetchProducts } from "../ports";

export const fetchProducts: FetchProducts = async (category) => {
  logInfo("Fetching products...", { category: category.urlName });

  return createApiClient()
    .flatMap((client) =>
      fetchAllPages({
        fetchPage: (pageNumber) => fetchCategoryPage(client, category, pageNumber),
        delay: () => randomDelay({ min: 1000, max: 2000 }),
      }),
    )
    .tap((products) => {
      logInfo("Fetched products", {
        category: category.urlName,
        productCount: products.length,
      });
    })
    .unwrap();
};
