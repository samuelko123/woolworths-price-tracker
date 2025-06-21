import { z, type ZodEffects, type ZodString } from "zod";

export const JsonStringSchema: ZodEffects<ZodString, unknown, string> = z.string().transform((val, ctx) => {
  try {
    return JSON.parse(val);
  } catch {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid JSON string",
    });
    return z.NEVER;
  }
});
