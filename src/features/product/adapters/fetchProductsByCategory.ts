import { type AxiosInstance } from "axios";

import { createHttpClient } from "@/core/http";
import { logInfo } from "@/core/logger";
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

type DelayRange = {
  min: number;
  max: number;
};

const randomDelay = async (delayRange: DelayRange): Promise<void> => {
  const { min, max } = delayRange;
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

export const fetchAllPages = async (
  client: AxiosInstance,
  category: Category,
  delayRange = { min: 1000, max: 2000 },
): Promise<Product[]> => {
  const allProducts: Product[] = [];
  let pageNumber = 1;
  let total = 0;

  do {
    const { total: newTotal, products } = await fetchCategoryProductsPage({
      client,
      category,
      pageNumber,
    });

    total = newTotal;
    allProducts.push(...products);
    pageNumber++;

    await randomDelay({ min: delayRange.min, max: delayRange.max });
  } while (allProducts.length < total);

  return allProducts;
};

export const fetchCategoryProducts: FetchProductsByCategory = async (category) => {
  logInfo("Fetching products...", { category: category.urlName });

  const { client } = createHttpClient("https://www.woolworths.com.au");
  await initCookies(client);

  const products = await fetchAllPages(client, category);

  logInfo("Fetched products", {
    category: category.urlName,
    productCount: products.length,
  });

  return products;
};

const fetchCategoryProductsPage = async ({
  client,
  category,
  pageNumber,
}: {
  client: AxiosInstance;
  category: Category;
  pageNumber: number;
}): Promise<{ total: number; products: Product[] }> => {
  const payload = createCategoryProductsPayload(category, pageNumber);
  const res = await client.post("/apis/ui/browse/category", payload);
  return CategoryProductsDTOSchema.parse(res.data);
};
