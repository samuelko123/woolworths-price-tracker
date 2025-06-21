import { JsonStringSchema } from "@/core/json";
import { CategorySchema } from "@/domain";

export const CategoryMessageSchema = JsonStringSchema.pipe(CategorySchema);
