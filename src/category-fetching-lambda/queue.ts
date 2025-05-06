import {
  PurgeQueueCommand,
  SQSClient,
  SendMessageCommand,
} from "@aws-sdk/client-sqs";
import { Category } from "../shared/schema";

const sqs = new SQSClient({
  region: process.env.AWS_REGION,
});

export const purgeCategoryQueue = async (): Promise<void> => {
  const params = {
    QueueUrl: process.env.CATEGORY_QUEUE_URL,
  };

  const command = new PurgeQueueCommand(params);
  await sqs.send(command);
};

export const pushToCategoryQueue = async (
  categories: Category[]
): Promise<void> => {
  for (const category of categories) {
    const params = {
      QueueUrl: process.env.CATEGORY_QUEUE_URL,
      MessageBody: JSON.stringify(category),
    };

    const command = new SendMessageCommand(params);
    await sqs.send(command);
  }
};
