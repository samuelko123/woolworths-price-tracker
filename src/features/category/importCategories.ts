import { ResultAsync } from "neverthrow";

import {
  type FetchCategories,
  type FilterCategories,
  type GetCategoryQueueUrl,
  type ParseCategories,
  type PurgeQueue,
  type SendMessages,
} from "./ports";

export const importCategories = ({
  fetchCategories,
  parseCategories,
  filterCategories,
  getCategoryQueueUrl,
  purgeQueue,
  sendMessages,
}: {
  fetchCategories: FetchCategories;
  parseCategories: ParseCategories;
  filterCategories: FilterCategories;
  getCategoryQueueUrl: GetCategoryQueueUrl;
  purgeQueue: PurgeQueue;
  sendMessages: SendMessages;
}): ResultAsync<void, Error> => {
  const categoriesResult = fetchCategories()
    .andThen(parseCategories)
    .andThen(filterCategories);

  const queueUrlResult = getCategoryQueueUrl();

  return ResultAsync
    .combine([queueUrlResult, categoriesResult])
    .andThen(([queueUrl, categories]) => {
      return purgeQueue(queueUrl).andThen(() => sendMessages(queueUrl, categories));
    });
};
