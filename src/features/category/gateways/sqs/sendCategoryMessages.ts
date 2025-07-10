import { okAsync, type ResultAsync } from "neverthrow";

import { sendMessage } from "@/gateways/sqs";

import { type SendCategoryMessages } from "../../application/use-cases/importCategories.ports";

export const sendCategoryMessages: SendCategoryMessages = (queueUrl, categories) => {
  return categories.reduce<ResultAsync<void, Error>>(
    (acc, category) => acc.andThen(() => sendMessage(queueUrl, category)),
    okAsync(),
  );
};
