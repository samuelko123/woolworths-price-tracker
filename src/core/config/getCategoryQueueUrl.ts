import { errAsync, okAsync, type ResultAsync } from "neverthrow";

export const getCategoryQueueUrl = (): ResultAsync<string, Error> => {
  const url = process.env.CATEGORY_QUEUE_URL;

  return url
    ? okAsync(url)
    : errAsync(new Error("Missing CATEGORY_QUEUE_URL"));
};
