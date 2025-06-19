import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";

import { logInfo } from "@/core/logger";
import { Category } from "@/domain";

import { DequeueCategory } from "../ports";
import { CategoryMessageSchema } from "./dequeueCategory.schema";

const sqs = new SQSClient({
  region: process.env.AWS_REGION,
});

export const dequeueCategory: DequeueCategory = async () => {
  logInfo("Start pulling a category to queue...");

  const queueUrl = process.env.CATEGORY_QUEUE_URL;
  const input = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 5,
    VisibilityTimeout: 30,
  };
  const command = new ReceiveMessageCommand(input);

  const result = await sqs.send(command);
  if (!result.Messages || result.Messages.length === 0) {
    return null;
  }

  const message = result.Messages[0];
  if (!message.Body || !message.ReceiptHandle) {
    throw new Error("Received message does not contain Body or ReceiptHandle.");
  }

  const category: Category = CategoryMessageSchema.parse(JSON.parse(message.Body));
  const handle = message.ReceiptHandle;

  logInfo("Finished pulling a category from queue.", { category: category.urlName });

  return {
    category,
    acknowledge: async () => {
      logInfo("Deleting a message from category queue...", { category: category.urlName });

      const deleteCommand = new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: handle,
      });

      await sqs.send(deleteCommand);

      logInfo("Finished deleting a message from category queue.", { category: category.urlName });
    },
  };
};
