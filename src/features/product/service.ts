import { logInfo } from "@/core/logger";

import { dequeueCategory, fetchCategoryProducts, saveProduct } from "./adapters";

export const saveProductsForNextCategory = async (): Promise<void> => {
  logInfo("Starting product fetching process...");
  const start = Date.now();

  const result = await dequeueCategory();
  if (!result) {
    logInfo("No messages received from the category queue.");
    return;
  }

  const { category } = result;
  const products = await fetchCategoryProducts(category);
  for (const product of products) {
    await saveProduct(product);
  }

  const { acknowledge } = result;
  await acknowledge();

  logInfo("Finished product fetching process.", { duration: Date.now() - start });
};
