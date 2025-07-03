import { ResultAsync } from "neverthrow";

import {
  type FetchCategories,
  type FilterCategories,
  type GetCategoryQueueUrl,
  type ParseCategories,
  type PurgeQueue,
  type SendCategoryMessages,
} from "./ports";

export const importCategories = ({
  fetchCategories,
  parseCategories,
  filterCategories,
  getCategoryQueueUrl,
  purgeQueue,
  sendCategoryMessages,
}: {
  fetchCategories: FetchCategories;
  parseCategories: ParseCategories;
  filterCategories: FilterCategories;
  getCategoryQueueUrl: GetCategoryQueueUrl;
  purgeQueue: PurgeQueue;
  sendCategoryMessages: SendCategoryMessages;
}): ResultAsync<void, Error> => {
  const categoriesResult = fetchCategories()
    .andThen(parseCategories)
    .andThen(filterCategories);

  const queueUrlResult = getCategoryQueueUrl();

  return ResultAsync
    .combine([queueUrlResult, categoriesResult])
    .andThen(([queueUrl, categories]) => {
      return purgeQueue(queueUrl).andThen(() => sendCategoryMessages(queueUrl, categories));
    });
};
