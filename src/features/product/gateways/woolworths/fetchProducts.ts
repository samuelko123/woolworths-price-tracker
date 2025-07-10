import { type AxiosInstance } from "axios";
import { ResultAsync } from "neverthrow";

import { toError } from "@/core/error";
import { fetchAllPages } from "@/core/pagination";
import { randomDelay } from "@/core/timing";
import { parseWithSchema } from "@/core/validation";
import { type Category } from "@/features/category";
import { createApiClient } from "@/gateways/woolworths";

import { type FetchProducts } from "../../application/use-cases/importProducts.ports";
import { WoolworthsProductsResponseSchema } from "./fetchProducts.schema";

const buildPayload = (category: Category, pageNumber: number) => {
  const urlPath = `/shop/browse/${category.urlName}?pageNumber=${pageNumber}&sortBy=Name`;

  return {
    categoryId: category.id,
    pageNumber,
    pageSize: 24,
    sortType: "Name",
    url: urlPath,
    location: urlPath,
    formatObject: JSON.stringify({ name: category.displayName }),
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
};

const fetchProductPage = (client: AxiosInstance, category: Category, pageNumber: number) => {
  const payload = buildPayload(category, pageNumber);

  return ResultAsync
    .fromPromise(client.post("/apis/ui/browse/category", payload), toError)
    .map((res) => res.data);
};

const fetchProductPages = (client: AxiosInstance, category: Category) => {
  return fetchAllPages({
    fetchPage: (pageNumber) => {
      return fetchProductPage(client, category, pageNumber)
        .andThen(data => parseWithSchema(WoolworthsProductsResponseSchema, data));
    },
    delay: () => randomDelay({ min: 1000, max: 2000 }),
  });
};

export const fetchProducts: FetchProducts = (category: Category) => {
  return createApiClient()
    .andThen(client => fetchProductPages(client, category));
};
