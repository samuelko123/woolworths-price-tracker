import { logInfo } from "@/core/logger";

import { enqueueCategories, fetchCategories, purgeCategoryQueue } from "./adapters";

export const fetchAndQueueCategories = async (): Promise<void> => {
  logInfo("Starting category fetching process...");
  const start = Date.now();

  const categories = await fetchCategories();
  const filteredCategories = categories.filter(
    (category) => category.id !== "specialsgroup" && category.urlName !== "front-of-store",
  );
  await purgeCategoryQueue();
  await enqueueCategories(filteredCategories);

  logInfo("Finished category fetching process.", { duration: Date.now() - start });
};
