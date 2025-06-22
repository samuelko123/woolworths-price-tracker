import z from "zod";

export const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  AWS_REGION: z.string().min(1),
  CATEGORY_QUEUE_URL: z.string().url(),
});

export type EnvVars = z.infer<typeof EnvSchema>;
