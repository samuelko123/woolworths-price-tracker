import { fetchCategories } from "./apiClient";
import { pushToCategoryQueue } from "./queue";

export const main = async (): Promise<void> => {
  const categoriesDTO = await fetchCategories();
  const { categories } = categoriesDTO;
  await pushToCategoryQueue(categories);
};
