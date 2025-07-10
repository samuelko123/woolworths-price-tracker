import { okAsync, type ResultAsync } from "neverthrow";

import { type SendCategoryMessages } from "@/features/category";
import { sendMessage } from "@/gateways/sqs";

export const sendCategoryMessages: SendCategoryMessages = (queueUrl, categories) => {
  return categories.reduce<ResultAsync<void, Error>>(
    (acc, category) => acc.andThen(() => sendMessage(queueUrl, category)),
    okAsync(),
  );
};
