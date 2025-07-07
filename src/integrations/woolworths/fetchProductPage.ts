import { type AxiosInstance } from "axios";
import { ResultAsync } from "neverthrow";

import { toError } from "@/core/error";
import { type Category } from "@/features/category";
import { type FetchProductPage } from "@/features/product";

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

export const fetchProductPageWith = (client: AxiosInstance) => {
  const fetchProductPage: FetchProductPage = (category, pageNumber) => {
    const payload = buildPayload(category, pageNumber);

    return ResultAsync
      .fromPromise(client.post("/apis/ui/browse/category", payload), toError)
      .map((res) => res.data);
  };

  return fetchProductPage;
};
