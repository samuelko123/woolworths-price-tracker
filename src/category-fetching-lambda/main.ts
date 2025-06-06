import { logger } from "../shared/logger";
import { fetchCategories } from "./apiClient";
import { purgeCategoryQueue, pushToCategoryQueue } from "./queue";

export const main = async (): Promise<void> => {
  logger.info("Starting category fetching process...");

  const categoriesDTO = await fetchCategories();
  const { categories } = categoriesDTO;
  const filteredCategories = categories.filter(
    (category) => category.id !== "specialsgroup"
  );
  await purgeCategoryQueue();
  await pushToCategoryQueue(filteredCategories);

  logger.info("Finished category fetching process.");
};
