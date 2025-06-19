import { logger } from "src/core/adapter/logger";

import { dequeueCategory, fetchCategoryProducts, saveProduct } from "./adapters";

export const saveProductsForNextCategory = async (): Promise<void> => {
  logger.info("Starting product fetching process...");
  const start = Date.now();

  const result = await dequeueCategory();
  if (!result) {
    logger.info("No messages received from the category queue.");
    return;
  }

  const { category } = result;
  const products = await fetchCategoryProducts(category);
  for (const product of products) {
    await saveProduct(product);
  }

  const { acknowledge } = result;
  await acknowledge();

  logger.info({
    message: "Finished product fetching process.",
    duration: Date.now() - start,
  });
};
