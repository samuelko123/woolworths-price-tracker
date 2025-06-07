import { CategoriesDTO, CategoriesDTOSchema, Category, CategoryProductsDTOSchema, Product } from "../shared/schema";
import { logger } from "../shared/logger";
import axios, { AxiosInstance } from "axios";

export const fetchCategories = async (): Promise<CategoriesDTO> => {
  logger.info("Start fetching categories from Woolworths API...");

  const client = axios.create({
    baseURL: "https://www.woolworths.com.au",
    timeout: 5000,
    headers: {
      accept: "application/json",
      "accept-encoding": "gzip, compress, deflate, br",
      "accept-language": "en-US,en;q=0.5",
      "cache-control": "no-cache",
      connection: "keep-alive",
      host: "www.woolworths.com.au",
      referer: "https://www.woolworths.com.au/",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:137.0) Gecko/20100101 Firefox/137.0",
    },
  });

  const res = await client.get("/apis/ui/PiesCategoriesWithSpecials");
  const dto = CategoriesDTOSchema.parse(res.data)

  logger.info("Finished fetching categories from Woolworths API.");
  return dto;
};

export const fetchCategoryProducts = async (
  category: Category
): Promise<Product[]> => {
  const client = axios.create({
    baseURL: "https://www.woolworths.com.au",
    timeout: 5000,
    headers: {
      accept: "application/json",
      "accept-encoding": "gzip, compress, deflate, br",
      "accept-language": "en-US,en;q=0.5",
      "cache-control": "no-cache",
      connection: "keep-alive",
      host: "www.woolworths.com.au",
      referer: "https://www.woolworths.com.au/",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:137.0) Gecko/20100101 Firefox/137.0",
    },
  });

  const { products } = await fetchCategoryProductsPage({
    client,
    category,
    pageNumber: 1,
  });

  return products;
}

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
