import { JsonStringSchema } from "@/core/json";
import { parseWithSchema } from "@/core/validation";
import { CategorySchema } from "@/domain";

import { type ParseCategory } from "../ports";

const CategoryMessageSchema = JsonStringSchema.pipe(CategorySchema);

export const parseCategory: ParseCategory = (message) => {
  return parseWithSchema(CategoryMessageSchema, message.body);
};
