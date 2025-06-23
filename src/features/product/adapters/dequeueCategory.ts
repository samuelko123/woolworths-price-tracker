import { getEnv } from "@/core/config";
import { logInfo } from "@/core/logger";
import { isPresent } from "@/core/option";
import { deleteMessage, receiveMessage } from "@/core/sqs";

import { type DequeueCategory } from "../ports";
import { CategoryMessageSchema } from "./dequeueCategory.schema";

export const dequeueCategory: DequeueCategory = async () => {
  const envResult = getEnv();
  if (!envResult.success) {
    throw envResult.error;
  }
  const { CATEGORY_QUEUE_URL } = envResult.value;

  const messageResult = await receiveMessage(CATEGORY_QUEUE_URL);
  if (!messageResult.success) {
    throw messageResult.error;
  }
  const maybeMessage = messageResult.value;
  if (!isPresent(maybeMessage)) {
    logInfo("No messages received from the category queue.");
    return null;
  }
  const { Body, ReceiptHandle } = maybeMessage.value;

  const category = CategoryMessageSchema.parse(Body);
  logInfo("Received category from queue.", { category: category.urlName });

  return {
    category,
    acknowledge: async () => {
      await deleteMessage(CATEGORY_QUEUE_URL, ReceiptHandle);
      logInfo("Deleted message from category queue.", { category: category.urlName });
    },
  };
};
