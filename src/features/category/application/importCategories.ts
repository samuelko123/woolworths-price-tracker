import { ResultAsync } from "neverthrow";

import { filterCategories } from "../domain/filterCategories";
import {
  type FetchCategories,
  type GetCategoryQueueUrl,
  type ParseCategories,
  type PurgeQueue,
  type SendCategoryMessages,
} from "./ports";

export const importCategories = ({
  fetchCategories,
  parseCategories,
  getCategoryQueueUrl,
  purgeQueue,
  sendCategoryMessages,
}: {
  fetchCategories: FetchCategories;
  parseCategories: ParseCategories;
  getCategoryQueueUrl: GetCategoryQueueUrl;
  purgeQueue: PurgeQueue;
  sendCategoryMessages: SendCategoryMessages;
}): ResultAsync<void, Error> => {
  const categoriesResult = fetchCategories()
    .andThen(parseCategories)
    .map(filterCategories);

  const queueUrlResult = getCategoryQueueUrl();

  return ResultAsync
    .combine([queueUrlResult, categoriesResult])
    .andThen(([queueUrl, categories]) => {
      return purgeQueue(queueUrl).andThen(() => sendCategoryMessages(queueUrl, categories));
    });
};
