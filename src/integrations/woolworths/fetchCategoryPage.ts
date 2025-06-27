import { type AxiosInstance } from "axios";

import { ResultAsync } from "@/core/result";
import { parseWithSchema } from "@/core/validation";
import { type Category } from "@/domain";

import {
  type WoolworthsCategoryResponse,
  WoolworthsCategoryResponseSchema,
} from "./fetchCategoryPage.schema";

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

export const fetchCategoryPage = (
  client: AxiosInstance,
  category: Category,
  pageNumber: number,
): ResultAsync<WoolworthsCategoryResponse> => {
  const payload = buildPayload(category, pageNumber);

  return ResultAsync
    .fromPromise(client.post("/apis/ui/browse/category", payload))
    .map((res) => res.data)
    .flatMap((data) => parseWithSchema(WoolworthsCategoryResponseSchema, data));
};
