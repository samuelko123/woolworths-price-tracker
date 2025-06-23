import { err, ok, type Result } from "../result/Result";
import { EnvSchema, type EnvVars } from "./env.schema";

let cached: Result<EnvVars> | null = null;

export const getEnv = (): Result<EnvVars> => {
  if (cached) {
    return cached;
  }

  const result = EnvSchema.safeParse(process.env);
  cached = result.success ? ok(result.data) : err(result.error);

  return cached;
};

export const resetEnvCache = (): void => {
  cached = null;
};
