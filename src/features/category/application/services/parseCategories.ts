import { type ResultAsync } from "neverthrow";

import { parseWithSchema } from "@/core/validation";

import { type Category } from "../../domain/category";
import { WoolworthsCategoriesResponseSchema } from "./parseCategories.schema";

export const parseCategories = (data: unknown): ResultAsync<Category[], Error> => {
  return parseWithSchema(WoolworthsCategoriesResponseSchema, data);
};
