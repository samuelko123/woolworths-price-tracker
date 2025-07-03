import { errAsync, okAsync } from "neverthrow";

import { type ParseCategories } from "../application/ports";
import { CategoriesDTOSchema } from "./parseCategories.schema";

export const parseCategories: ParseCategories = (data: unknown) => {
  const parsed = CategoriesDTOSchema.safeParse(data);

  return parsed.success
    ? okAsync(parsed.data)
    : errAsync(parsed.error);
};
