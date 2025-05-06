import { fetchCategories } from "./apiClient";
import { purgeCategoryQueue, pushToCategoryQueue } from "./queue";

export const main = async (): Promise<void> => {
  const categoriesDTO = await fetchCategories();
  const { categories } = categoriesDTO;
  const filteredCategories = categories.filter(
    (category) => category.id !== "specialsgroup"
  );
  await purgeCategoryQueue();
  await pushToCategoryQueue(filteredCategories);
};
