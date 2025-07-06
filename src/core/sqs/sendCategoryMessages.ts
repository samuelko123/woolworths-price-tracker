import { okAsync, type ResultAsync } from "neverthrow";

import { sendMessage } from "./sendMessage";

export const sendCategoryMessages = <T extends Record<string, unknown>>(queueUrl: string, items: T[]): ResultAsync<void, Error> => {
  return items.reduce<ResultAsync<void, Error>>(
    (acc, item) => acc.andThen(() => sendMessage(queueUrl, item)),
    okAsync(),
  );
};
