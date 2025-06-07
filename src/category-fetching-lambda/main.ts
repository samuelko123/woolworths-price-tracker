import { fetchCategories } from "../shared/apiClient";
import { logger } from "../shared/logger";
import { purgeCategoryQueue, pushToCategoryQueue } from "../shared/queue";


export const main = async (): Promise<void> => {
  logger.info("Starting category fetching process...");
  const start = Date.now();

  const categoriesDTO = await fetchCategories();
  const { categories } = categoriesDTO;
  const filteredCategories = categories.filter(
    (category) => category.id !== "specialsgroup"
  );
  await purgeCategoryQueue();
  await pushToCategoryQueue(filteredCategories);

  logger.info({
    message: "Finished category fetching process.",
    duration: Date.now() - start,
  });
};
