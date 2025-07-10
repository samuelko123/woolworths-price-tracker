import { okAsync, type ResultAsync } from "neverthrow";

import { getCategoryQueueUrl } from "@/core/config";
import { sendMessage } from "@/gateways/sqs";

import { type SendCategoryMessages } from "../../application/use-cases/importCategories.ports";
import { type Category } from "../../domain/category";

const sendAllMessages = (
  queueUrl: string,
  categories: Category[],
): ResultAsync<void, Error> => {
  return categories.reduce<ResultAsync<void, Error>>(
    (acc, category) => acc.andThen(() => sendMessage(queueUrl, category)),
    okAsync(),
  );
};

export const sendCategoryMessages: SendCategoryMessages = (categories) => {
  return getCategoryQueueUrl()
    .andThen((queueUrl) => sendAllMessages(queueUrl, categories));
};
