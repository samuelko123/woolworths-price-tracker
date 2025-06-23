import { getEnv } from "@/core/config";
import { logInfo } from "@/core/logger";
import { isPresent } from "@/core/option";
import { err, ok } from "@/core/result";
import { deleteMessage, receiveMessage } from "@/core/sqs";

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

  const maybeMessage = messageResult.value;
  if (!isPresent(maybeMessage)) {
    return err(new Error("No messages received from the category queue."));
  }
  const { Body, ReceiptHandle } = maybeMessage.value;

  const categoryResult = CategoryMessageSchema.safeParse(Body);
  if (!categoryResult.success) {
    return err(categoryResult.error);
  }

  const category = categoryResult.data;
  logInfo("Received category from queue.", { category: category.urlName });

  return ok({
    category,
    acknowledge: async () => {
      await deleteMessage(CATEGORY_QUEUE_URL, ReceiptHandle);
      logInfo("Deleted message from category queue.", { category: category.urlName });
    },
  });
};
