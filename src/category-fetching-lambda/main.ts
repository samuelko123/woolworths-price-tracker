import { fetchCategories } from "./apiClient";
import { sendToCategoryQueue } from "./queue";

export const main = async (): Promise<void> => {
  const categoriesDTO = await fetchCategories();
  const { categories } = categoriesDTO;
  await sendToCategoryQueue(categories);
};
