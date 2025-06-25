import { type AxiosInstance } from "axios";

import { ResultAsync } from "@/core/result";
import { type Category } from "@/domain";

import { type WoolworthsCategoryPayload, type WoolworthsCategoryResponse, WoolworthsCategoryResponseSchema } from "./categoryApi.schema";

export const createCategoryPayload = (category: Category, pageNumber: number): WoolworthsCategoryPayload => ({
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

export const postCategoryRequest = (
  client: AxiosInstance,
  payload: WoolworthsCategoryPayload,
): ResultAsync<unknown> =>
  ResultAsync
    .fromPromise(client.post("/apis/ui/browse/category", payload))
    .map((res) => res.data);

export const parseCategoryResponse = (data: unknown): ResultAsync<WoolworthsCategoryResponse> => {
  const parsed = WoolworthsCategoryResponseSchema.safeParse(data);
  return parsed.success ? ResultAsync.ok(parsed.data) : ResultAsync.err(parsed.error);
};
