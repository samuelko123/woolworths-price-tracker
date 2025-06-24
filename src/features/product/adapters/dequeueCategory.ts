import { getEnv } from "@/core/config";
import { logInfo } from "@/core/logger";
import { err, ok } from "@/core/result";
import { receiveMessage } from "@/core/sqs";

import { type DequeueCategory } from "../ports";
import { CategoryMessageSchema } from "./dequeueCategory.schema";

export const dequeueCategory: DequeueCategory = async () => {
  const envResult = getEnv();
  if (!envResult.success) {
    return err(envResult.error);
  }
  const { CATEGORY_QUEUE_URL } = envResult.value;

  const messageResult = await receiveMessage(CATEGORY_QUEUE_URL);
  if (!messageResult.success) {
    return err(messageResult.error);
  }
  const { body, acknowledge } = messageResult.value;

  const categoryResult = CategoryMessageSchema.safeParse(body);
  if (!categoryResult.success) {
    return err(categoryResult.error);
  }

  const category = categoryResult.data;
  logInfo("Received category from queue.", { category: category.urlName });

  return ok({
    category,
    acknowledge,
  });
};
