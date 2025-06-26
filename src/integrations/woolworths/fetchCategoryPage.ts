import { type AxiosInstance } from "axios";

import { ResultAsync } from "@/core/result";
import { type Category } from "@/domain";

import {
  type WoolworthsCategoryResponse,
  WoolworthsCategoryResponseSchema,
} from "./fetchCategoryPage.schema";

export const fetchCategoryPage = (
  client: AxiosInstance,
  category: Category,
  pageNumber: number,
): ResultAsync<WoolworthsCategoryResponse> => {
  const payload = {
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
  };

  return ResultAsync
    .fromPromise(client.post("/apis/ui/browse/category", payload))
    .map((res) => res.data)
    .flatMap((data) => {
      const parsed = WoolworthsCategoryResponseSchema.safeParse(data);
      return parsed.success
        ? ResultAsync.ok(parsed.data)
        : ResultAsync.err(parsed.error);
    });
};
