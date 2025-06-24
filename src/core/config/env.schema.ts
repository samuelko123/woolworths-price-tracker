import z from "zod";

export const EnvSchema = z.object({
  AWS_REGION: z.string().min(1),
  CATEGORY_QUEUE_URL: z.string().url(),
});

export type EnvVars = z.infer<typeof EnvSchema>;
