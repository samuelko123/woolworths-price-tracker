import {
  PurgeQueueCommand,
  ReceiveMessageCommand,
  SQSClient,
  SendMessageCommand,
} from "@aws-sdk/client-sqs";
import { Category, CategoryMessageSchema } from "../shared/schema";
import { logger } from "../shared/logger";

type ReceiptHandle = string;

const sqs = new SQSClient({
  region: process.env.AWS_REGION,
});

export const purgeCategoryQueue = async (): Promise<void> => {
  const queueUrl = process.env.CATEGORY_QUEUE_URL;
  logger.info({
    message: "Start purging category queue...",
    queueUrl,
  });

  const params = {
    QueueUrl: queueUrl,
  };

  const command = new PurgeQueueCommand(params);
  const result = await sqs.send(command);

  logger.info({
    message: "Finished purging category queue.",
    status: result.$metadata.httpStatusCode,
  });
};

export const pushToCategoryQueue = async (
  categories: Category[]
): Promise<void> => {
  const queueUrl = process.env.CATEGORY_QUEUE_URL;
  logger.info({
    message: "Start pushing categories to queue...",
    queueUrl,
    categoriesCount: categories.length,
  });

  for (const category of categories) {
    const params = {
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(category),
    };

    const command = new SendMessageCommand(params);
    await sqs.send(command);
  }

  logger.info("Finished pushing categories to queue.");
};

export const pullFromCategoryQueue = async (): Promise<{
  category: Category;
  handle: ReceiptHandle;
}> => {
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
    logger.error("No messages received from the category queue.");
    throw new Error("No messages received from the category queue.");
  }

  const message = result.Messages[0];
  if (!message.Body || !message.ReceiptHandle) {
    logger.error("Received message does not contain Body or ReceiptHandle.");
    throw new Error("Received message does not contain Body or ReceiptHandle.");
  }

  const category = CategoryMessageSchema.parse(JSON.parse(message.Body));
  const handle = message.ReceiptHandle;

  logger.info({
    message: "Finished pulling a category from queue.",
    categoryId: category.id,
  });
  return {
    category,
    handle,
  };
};

export const deleteFromCategoryQueue = async (
  handle: ReceiptHandle
): Promise<void> => {

};
