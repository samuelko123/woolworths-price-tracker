import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  AWS_REGION: z.string().min(1),
  CATEGORY_QUEUE_URL: z.string().url(),
});

type EnvVars = z.infer<typeof EnvSchema>;

let cachedEnv: EnvVars | null = null;

export const getEnv = (): EnvVars => {
  if (!cachedEnv) {
    cachedEnv = EnvSchema.parse(process.env);
  }

  return cachedEnv;
};

export const resetEnvCache = () => {
  cachedEnv = null;
};
