import { type ZodType, type ZodTypeDef } from "zod";

import { ResultAsync } from "../result";

export const parseWithSchema = <T>(
  schema: ZodType<T, ZodTypeDef, unknown>,
  data: unknown,
): ResultAsync<T> => {
  const parsed = schema.safeParse(data);
  return parsed.success
    ? ResultAsync.ok(parsed.data)
    : ResultAsync.err(parsed.error);
};
