import { getEnv } from "@/core/config";
import { createHttpClient } from "@/core/http";
import { logInfo } from "@/core/logger";
import { fetchAllPages } from "@/core/pagination";
import { randomDelay } from "@/core/timing";
import { fetchCategoryProductsPage, withCookies } from "@/integrations/woolworths";

import { type FetchProductsByCategory } from "../ports";

export const fetchCategoryProducts: FetchProductsByCategory = async (category) => {
  logInfo("Fetching products...", { category: category.urlName });

  const envResult = getEnv();
  if (!envResult.success) throw new Error("Failed to load environment variables");
  const { WOOLWORTHS_BASE_URL } = envResult.value;

  const client = await withCookies(createHttpClient(WOOLWORTHS_BASE_URL));
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
