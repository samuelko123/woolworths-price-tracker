import { getEnv } from "@/core/config";
import { logInfo } from "@/core/logger";
import { deleteMessage, receiveMessage } from "@/core/sqs";

import { type DequeueCategory } from "../ports";
import { CategoryMessageSchema } from "./dequeueCategory.schema";

export const dequeueCategory: DequeueCategory = async () => {
  const envResult = getEnv();
  if (!envResult.success) {
    throw envResult.error;
  }
  const { CATEGORY_QUEUE_URL } = envResult.value;

  const message = await receiveMessage(CATEGORY_QUEUE_URL);
  if (!message) {
    logInfo("No messages received from the category queue.");
    return null;
  }

  const category = CategoryMessageSchema.parse(message.Body);
  logInfo("Received category from queue.", { category: category.urlName });

  return {
    category,
    acknowledge: async () => {
      await deleteMessage(CATEGORY_QUEUE_URL, message.ReceiptHandle);
      logInfo("Deleted message from category queue.", { category: category.urlName });
    },
  };
};
