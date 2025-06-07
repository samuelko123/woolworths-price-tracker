import { logger } from "../shared/logger";
import {
  deleteFromCategoryQueue,
  pullFromCategoryQueue,
} from "../shared/queue";

export const main = async (): Promise<void> => {
  logger.info("Starting product fetching process...");
  const start = Date.now();

  const { handle } = await pullFromCategoryQueue();
  await deleteFromCategoryQueue(handle);

  logger.info({
    message: "Finished product fetching process.",
    duration: Date.now() - start,
  });
};
