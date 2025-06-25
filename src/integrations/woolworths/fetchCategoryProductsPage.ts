import { type AxiosInstance } from "axios";

import { type Page } from "@/core/pagination";
import { ResultAsync } from "@/core/result";
import { type Category, type Product } from "@/domain";

import { CategoryProductsDTOSchema } from "./fetchCategoryProductsPage.schema";

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

export const fetchCategoryProductsPage = ({
  client,
  category,
  pageNumber,
}: {
  client: AxiosInstance;
  category: Category;
  pageNumber: number;
}): ResultAsync<Page<Product>> => {
  const payload = createCategoryProductsPayload(category, pageNumber);

  return ResultAsync.fromPromise(client.post("/apis/ui/browse/category", payload))
    .flatMap((res) => {
      const parsed = CategoryProductsDTOSchema.safeParse(res.data);
      return parsed.success
        ? ResultAsync.ok({ total: parsed.data.total, items: parsed.data.products })
        : ResultAsync.err(parsed.error);
    });
};
