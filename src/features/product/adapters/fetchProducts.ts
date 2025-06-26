import { logInfo } from "@/core/logger";
import { fetchAllPages } from "@/core/pagination";
import { randomDelay } from "@/core/timing";
import { type Category, type Product } from "@/domain";
import { createApiClient, fetchCategoryPage } from "@/integrations/woolworths";

export const fetchProducts = async (category: Category): Promise<Product[]> => {
  logInfo("Fetching products...", { category: category.urlName });

  const client = await createApiClient().unwrapOrThrow();
  const products = await fetchAllPages({
    fetchPage: (pageNumber) => fetchCategoryPage(client, category, pageNumber),
    delay: () => randomDelay({ min: 1000, max: 2000 }),
  }).unwrapOrThrow();

  logInfo("Fetched products", {
    category: category.urlName,
    productCount: products.length,
  });

  return products;
};
