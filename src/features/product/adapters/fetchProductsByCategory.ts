import axios, { AxiosInstance } from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

import { logInfo } from "@/core/logger";
import { Category, Product } from "@/domain";

import { FetchProductsByCategory } from "../ports";
import { CategoryProductsDTOSchema } from "./fetchProductsByCategory.schema";
import { fetchAllPaginated } from "./utils/fetchAllPaginated";

export const fetchCategoryProducts: FetchProductsByCategory = async (category) => {
  logInfo("Start fetching products for category", { category: category.urlName });

  const jar = new CookieJar();
  const client = wrapper(
    axios.create({
      baseURL: "https://www.woolworths.com.au",
      timeout: 5000,
      jar,
      withCredentials: true,
    }),
  );

  // get cookies
  await client.get("/", {
    headers: {
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "accept-encoding": "gzip, deflate, br, zstd",
      "accept-language": "en-US,en;q=0.5",
      "cache-control": "no-cache",
      connection: "keep-alive",
      "content-type": "application/json",
      host: "www.woolworths.com.au",
      referer: "https://www.woolworths.com.au/",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:137.0) Gecko/20100101 Firefox/137.0",
    },
  });

  const products = await fetchAllPaginated(
    async (pageNumber: number) => {
      const { total, products } = await fetchCategoryProductsPage({
        client,
        category,
        pageNumber,
      });
      return { total, items: products };
    },
    {
      delayRange: { min: 1000, max: 2000 },
    },
  );

  logInfo("Finished fetching products for category", {
    category: category.urlName,
    productsCount: products.length,
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
  const categoryId = category.id;
  const categoryName = category.displayName;
  const categoryUrlName = category.urlName;
  const pageSize = 24;

  const payload = {
    categoryId,
    pageNumber,
    pageSize,
    sortType: "Name",
    url: `/shop/browse/${categoryUrlName}?pageNumber=${pageNumber}&sortBy=Name`,
    location: `/shop/browse/${categoryUrlName}?pageNumber=${pageNumber}&sortBy=Name`,
    formatObject: `{"name":"${categoryName}"}`,
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
  };

  const res = await client.post("/apis/ui/browse/category", payload, {
    headers: {
      accept: "application/json",
      "accept-encoding": "gzip, compress, deflate, br",
      "accept-language": "en-US,en;q=0.5",
      "cache-control": "no-cache",
      connection: "keep-alive",
      "content-type": "application/json",
      host: "www.woolworths.com.au",
      referer: "https://www.woolworths.com.au/",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:137.0) Gecko/20100101 Firefox/137.0",
    },
  });

  return CategoryProductsDTOSchema.parse(res.data);
};
