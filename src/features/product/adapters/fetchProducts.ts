import { logInfo } from "@/core/logger";
import { fetchAllPages } from "@/core/pagination";
import { type Result } from "@/core/result";
import { randomDelay } from "@/core/timing";
import { type Category, type Product } from "@/domain";
import { createApiClient, fetchCategoryPage } from "@/integrations/woolworths";

export const fetchProducts = async (category: Category): Promise<Result<Product[]>> => {
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
