import { fetchCategoryProducts } from "@/api/product";
import { saveProduct } from "@/database/product";
import { logger } from "@/src/shared/logger";

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
  const products = await fetchCategoryProducts(category);
  for (const product of products) {
    await saveProduct(product);
  }

  const { handle } = result;
  await deleteFromCategoryQueue(handle);

  logger.info({
    message: "Finished product fetching process.",
    duration: Date.now() - start,
  });
};
