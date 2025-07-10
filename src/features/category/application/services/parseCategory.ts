import { type ResultAsync } from "neverthrow";

import { JsonStringSchema } from "@/core/json";
import { parseWithSchema } from "@/core/validation";
import { type SqsMessage } from "@/gateways/sqs";

import { type Category, CategorySchema } from "../../domain/category";

const CategoryMessageSchema = JsonStringSchema.pipe(CategorySchema);

export const parseCategory = (message: SqsMessage): ResultAsync<Category, Error> => {
  return parseWithSchema(CategoryMessageSchema, message.body);
};
