import { logInfo } from "@/core/logger";
import { fetchAllPages } from "@/core/pagination";
import { randomDelay } from "@/core/timing";
import { createApiClient, fetchCategoryProductsPage } from "@/integrations/woolworths";

import { type FetchProductsByCategory } from "../ports";

export const fetchCategoryProducts: FetchProductsByCategory = async (category) => {
  logInfo("Fetching products...", { category: category.urlName });

  const client = await createApiClient();
  const products = await fetchAllPages({
    fetchPage: (pageNumber) => fetchCategoryProductsPage({ client, category, pageNumber }),
    delay: () => randomDelay({ min: 1000, max: 2000 }),
  });

  logInfo("Fetched products", {
    category: category.urlName,
    productCount: products.length,
  });

  return products;
};
