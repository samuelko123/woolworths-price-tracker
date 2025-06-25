import { type AxiosInstance } from "axios";

import { type Page } from "@/core/pagination";
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

export const fetchCategoryProductsPage = async ({
  client,
  category,
  pageNumber,
}: {
  client: AxiosInstance;
  category: Category;
  pageNumber: number;
}): Promise<Page<Product>> => {
  const payload = createCategoryProductsPayload(category, pageNumber);
  const res = await client.post("/apis/ui/browse/category", payload);
  const parsed = CategoryProductsDTOSchema.parse(res.data);

  return {
    total: parsed.total,
    items: parsed.products,
  };
};
