import { fetchCategories } from "@/api/category";
import { logger } from "@/src/shared/logger";
import { purgeCategoryQueue, pushToCategoryQueue } from "@/src/shared/queue";

export const main = async (): Promise<void> => {
  logger.info("Starting category fetching process...");
  const start = Date.now();

  const categoriesDTO = await fetchCategories();
  const { categories } = categoriesDTO;
  const filteredCategories = categories.filter(
    (category) => category.id !== "specialsgroup" && category.urlName !== "front-of-store",
  );
  await purgeCategoryQueue();
  await pushToCategoryQueue(filteredCategories);

  logger.info({
    message: "Finished category fetching process.",
    duration: Date.now() - start,
  });
};
