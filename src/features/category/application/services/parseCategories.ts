import { parseWithSchema } from "@/core/validation";

import { type ParseCategories } from "../use-cases/importCategories.ports";
import { WoolworthsCategoriesResponseSchema } from "./parseCategories.schema";

export const parseCategories: ParseCategories = (data) => {
  return parseWithSchema(WoolworthsCategoriesResponseSchema, data);
};
