import { parseWithSchema } from "@/core/validation";

import { type ParseCategories } from "../ports";
import { CategoriesDTOSchema } from "./parseCategories.schema";

export const parseCategories: ParseCategories = (data) => {
  return parseWithSchema(CategoriesDTOSchema, data);
};
