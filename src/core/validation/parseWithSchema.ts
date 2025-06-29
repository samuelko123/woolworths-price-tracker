import { errAsync, okAsync, type ResultAsync } from "neverthrow";
import { type ZodType, type ZodTypeDef } from "zod";

export const parseWithSchema = <T>(
  schema: ZodType<T, ZodTypeDef, unknown>,
  data: unknown,
): ResultAsync<T, Error> => {
  const parsed = schema.safeParse(data);
  return parsed.success
    ? okAsync(parsed.data)
    : errAsync(parsed.error);
};
