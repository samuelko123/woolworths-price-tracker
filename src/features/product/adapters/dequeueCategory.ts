import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";

import { Category } from "@/domain";
import { logger } from "@/logger";

import { DequeueCategory } from "../ports";
import { CategoryMessageSchema } from "./dequeueCategory.schema";

const sqs = new SQSClient({
  region: process.env.AWS_REGION,
});

export const dequeueCategory: DequeueCategory = async () => {
  const queueUrl = process.env.CATEGORY_QUEUE_URL;
  logger.info({
    message: "Start pulling a category to queue...",
    queueUrl,
  });

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

  logger.info({
    message: "Finished pulling a category from queue.",
    categoryId: category.id,
    categoryName: category.displayName,
  });
  return {
    category,
    acknowledge: async () => {
      logger.info({
        message: "Deleting a message from category queue...",
        queueUrl,
        handle,
      });

      const deleteCommand = new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: handle,
      });

      await sqs.send(deleteCommand);
      logger.info("Finished deleting a message from category queue.");
    },
  };
};
