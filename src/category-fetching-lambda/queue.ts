import {
  PurgeQueueCommand,
  SQSClient,
  SendMessageCommand,
} from "@aws-sdk/client-sqs";
import { Category } from "../shared/schema";
import { logger } from "../shared/logger";

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
  logger.info({
    message: "Start pushing categories to queue...",
    queueUrl: process.env.CATEGORY_QUEUE_URL,
    categoriesCount: categories.length,
  });

  for (const category of categories) {
    const params = {
      QueueUrl: process.env.CATEGORY_QUEUE_URL,
      MessageBody: JSON.stringify(category),
    };

    const command = new SendMessageCommand(params);
    await sqs.send(command);
  }

  console.log("Finished pushing categories to queue.");

};
