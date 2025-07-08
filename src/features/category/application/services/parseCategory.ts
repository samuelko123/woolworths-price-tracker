import { type ResultAsync } from "neverthrow";

import { JsonStringSchema } from "@/core/json";
import { type SqsMessage } from "@/core/sqs";
import { parseWithSchema } from "@/core/validation";

import { type Category, CategorySchema } from "../../domain/category";

const CategoryMessageSchema = JsonStringSchema.pipe(CategorySchema);

export const parseCategory = (message: SqsMessage): ResultAsync<Category, Error> => {
  return parseWithSchema(CategoryMessageSchema, message.body);
};
