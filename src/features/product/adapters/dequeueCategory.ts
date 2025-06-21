import {
  DeleteMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";

import { JsonStringSchema } from "@/core/json";
import { logInfo } from "@/core/logger";
import { receiveMessage } from "@/core/sqs";

import { type DequeueCategory } from "../ports";
import { CategoryMessageSchema } from "./dequeueCategory.schema";

const sqs = new SQSClient({
  region: process.env.AWS_REGION,
});

export const dequeueCategory: DequeueCategory = async () => {
  logInfo("Receiving category from queue...");

  const queueUrl = process.env.CATEGORY_QUEUE_URL;
  if (!queueUrl) {
    throw new Error("CATEGORY_QUEUE_URL environment variable is not set.");
  }

  const message = await receiveMessage(queueUrl);
  if (!message) {
    logInfo("No messages received from the category queue.");
    return null;
  }

  const parsed = JsonStringSchema.parse(message.Body);
  const category = CategoryMessageSchema.parse(parsed);
  const handle = message.ReceiptHandle;

  logInfo("Received category from queue.", { category: category.urlName });

  return {
    category,
    acknowledge: async () => {
      logInfo("Deleting category from queue...", { category: category.urlName });

      const deleteCommand = new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: handle,
      });

      await sqs.send(deleteCommand);

      logInfo("Deleted category from queue.", { category: category.urlName });
    },
  };
};
