import { ResultAsync } from "neverthrow";

import { excludeSpecialCategories } from "../../domain/excludeSpecialCategories";
import {
  type FetchCategories,
  type GetCategoryQueueUrl,
  type PurgeQueue,
  type SendCategoryMessages,
} from "./importCategories.ports";

export const importCategories = ({
  fetchCategories,
  getCategoryQueueUrl,
  purgeQueue,
  sendCategoryMessages,
}: {
  fetchCategories: FetchCategories;
  getCategoryQueueUrl: GetCategoryQueueUrl;
  purgeQueue: PurgeQueue;
  sendCategoryMessages: SendCategoryMessages;
}): ResultAsync<void, Error> => {
  const categoriesResult = fetchCategories()
    .map(excludeSpecialCategories);

  const queueUrlResult = getCategoryQueueUrl();

  return ResultAsync
    .combine([queueUrlResult, categoriesResult])
    .andThen(([queueUrl, categories]) => {
      return purgeQueue(queueUrl).andThen(() => sendCategoryMessages(queueUrl, categories));
    });
};
