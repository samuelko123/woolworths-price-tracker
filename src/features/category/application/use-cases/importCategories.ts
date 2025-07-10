import { type ResultAsync } from "neverthrow";

import { excludeSpecialCategories } from "../../domain/excludeSpecialCategories";
import { parseCategories } from "../services/parseCategories";
import {
  type FetchCategories,
  type PurgeCategoryQueue,
  type SendCategoryMessages,
} from "./importCategories.ports";

export const importCategories = ({
  purgeCategoryQueue,
  fetchCategories,
  sendCategoryMessages,
}: {
  purgeCategoryQueue: PurgeCategoryQueue;
  fetchCategories: FetchCategories;
  sendCategoryMessages: SendCategoryMessages;
}): ResultAsync<void, Error> => {
  return purgeCategoryQueue()
    .andThen(fetchCategories)
    .andThen(parseCategories)
    .map(excludeSpecialCategories)
    .andThen(sendCategoryMessages);
};
