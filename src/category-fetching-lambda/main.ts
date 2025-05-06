import { fetchCategories } from "./apiClient";
import { purgeCategoryQueue, pushToCategoryQueue } from "./queue";

export const main = async (): Promise<void> => {
  const categoriesDTO = await fetchCategories();
  const { categories } = categoriesDTO;
  await purgeCategoryQueue();
  await pushToCategoryQueue(categories);
};
