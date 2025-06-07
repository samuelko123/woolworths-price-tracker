import { fetchCategoryProducts } from "../shared/apiClient";
import { logger } from "../shared/logger";
import {
  deleteFromCategoryQueue,
  pullFromCategoryQueue,
} from "../shared/queue";

export const main = async (): Promise<void> => {
  logger.info("Starting product fetching process...");
  const start = Date.now();

  const result = await pullFromCategoryQueue();
  if (!result) {
    logger.info("No messages received from the category queue.");
    return;
  }

  const { category } = result;
  await fetchCategoryProducts(category);

  const { handle } = result;
  await deleteFromCategoryQueue(handle);

  logger.info({
    message: "Finished product fetching process.",
    duration: Date.now() - start,
  });
};
