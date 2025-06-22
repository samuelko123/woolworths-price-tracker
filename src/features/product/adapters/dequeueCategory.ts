import { logInfo } from "@/core/logger";
import { deleteMessage, receiveMessage } from "@/core/sqs";

import { type DequeueCategory } from "../ports";
import { CategoryMessageSchema } from "./dequeueCategory.schema";

export const dequeueCategory: DequeueCategory = async () => {
  const queueUrl = process.env.CATEGORY_QUEUE_URL;
  if (!queueUrl) {
    throw new Error("CATEGORY_QUEUE_URL environment variable is not set.");
  }

  const message = await receiveMessage(queueUrl);
  if (!message) {
    logInfo("No messages received from the category queue.");
    return null;
  }

  const category = CategoryMessageSchema.parse(message.Body);
  logInfo("Received category from queue.", { category: category.urlName });

  return {
    category,
    acknowledge: async () => {
      await deleteMessage(queueUrl, message.ReceiptHandle);
      logInfo("Deleted message from category queue.", { category: category.urlName });
    },
  };
};
