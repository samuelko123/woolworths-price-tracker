import { type AxiosInstance } from "axios";

import { getEnv } from "@/core/config";
import { createHttpClient } from "@/core/http";
import { logInfo } from "@/core/logger";
import { fetchAllPages } from "@/core/pagination";
import { type Category, type Product } from "@/domain";

import { type FetchProductsByCategory } from "../ports";
import { CategoryProductsDTOSchema } from "./fetchProductsByCategory.schema";

const initCookies = async (client: AxiosInstance) => {
  await client.get("/", {
    headers: {
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });
};

const createHttpClientWithCookies = async (baseURL: string) => {
  const { client } = createHttpClient(baseURL);
  await initCookies(client);
  return client;
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
}): Promise<{ total: number; items: Product[] }> => {
  const payload = createCategoryProductsPayload(category, pageNumber);
  const res = await client.post("/apis/ui/browse/category", payload);
  const parsed = CategoryProductsDTOSchema.parse(res.data);

  return {
    total: parsed.total,
    items: parsed.products,
  };
};

const randomDelay = async ({ min, max }: { min: number, max: number }): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
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
