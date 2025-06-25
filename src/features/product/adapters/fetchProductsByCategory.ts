import { type AxiosInstance } from "axios";

import { getEnv } from "@/core/config";
import { createHttpClient } from "@/core/http";
import { logInfo } from "@/core/logger";
import { fetchAllPages, type Page } from "@/core/pagination";
import { randomDelay } from "@/core/timing";
import { type Category, type Product } from "@/domain";
import { withCookies } from "@/integrations/woolworths";

import { type FetchProductsByCategory } from "../ports";
import { CategoryProductsDTOSchema } from "./fetchProductsByCategory.schema";

const createHttpClientWithCookies = async (baseURL: string) => {
  const client = createHttpClient(baseURL);
  return await withCookies(client);
};

const createCategoryProductsPayload = (category: Category, pageNumber: number) => ({
  categoryId: category.id,
  pageNumber,
  pageSize: 24,
  sortType: "Name",
  url: `/shop/browse/${category.urlName}?pageNumber=${pageNumber}&sortBy=Name`,
  location: `/shop/browse/${category.urlName}?pageNumber=${pageNumber}&sortBy=Name`,
  formatObject: `{"name":"${category.displayName}"}`,
  isSpecial: false,
  isBundle: false,
  isMobile: false,
  filters: [],
  token: "",
  gpBoost: 0,
  isHideUnavailableProducts: true,
  isRegisteredRewardCardPromotion: false,
  enableAdReRanking: false,
  groupEdmVariants: false,
  categoryVersion: "v2",
  flags: { EnablePersonalizationCategoryRestriction: true },
});

const fetchCategoryProductsPage = async ({
  client,
  category,
  pageNumber,
}: {
  client: AxiosInstance;
  category: Category;
  pageNumber: number;
}): Promise<Page<Product>> => {
  const payload = createCategoryProductsPayload(category, pageNumber);
  const res = await client.post("/apis/ui/browse/category", payload);
  const parsed = CategoryProductsDTOSchema.parse(res.data);

  return {
    total: parsed.total,
    items: parsed.products,
  };
};

export const fetchCategoryProducts: FetchProductsByCategory = async (category) => {
  logInfo("Fetching products...", { category: category.urlName });

  const envResult = getEnv();
  if (!envResult.success) throw new Error("Failed to load environment variables");
  const { WOOLWORTHS_BASE_URL } = envResult.value;

  const client = await createHttpClientWithCookies(WOOLWORTHS_BASE_URL);
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
