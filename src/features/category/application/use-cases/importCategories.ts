import { type ResultAsync } from "neverthrow";

import { excludeSpecialCategories } from "../../domain/excludeSpecialCategories";
import { parseCategories } from "../services/parseCategories";
import {
  type FetchCategories,
  type PurgeCategoryQueue,
  type SendCategoryMessages,
} from "./importCategories.ports";

export const importCategories = ({
  fetchCategories,
  purgeCategoryQueue,
  sendCategoryMessages,
}: {
  fetchCategories: FetchCategories;
  purgeCategoryQueue: PurgeCategoryQueue;
  sendCategoryMessages: SendCategoryMessages;
}): ResultAsync<void, Error> => {
  return fetchCategories()
    .andThen(parseCategories)
    .map(excludeSpecialCategories)
    .andThen((categories) => {
      return purgeCategoryQueue()
        .andThen(() => sendCategoryMessages(categories));
    });
};
