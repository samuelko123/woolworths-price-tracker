import { JsonStringSchema } from "@/core/json";
import { parseWithSchema } from "@/core/validation";
import { CategorySchema } from "@/features/category";

import { type ParseCategory } from "../use-cases/importProducts.ports";

const CategoryMessageSchema = JsonStringSchema.pipe(CategorySchema);

export const parseCategory: ParseCategory = (message) => {
  return parseWithSchema(CategoryMessageSchema, message.body);
};
