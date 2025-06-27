import { type ResultAsync } from "../result";
import { parseWithSchema } from "../validation";
import { EnvSchema, type EnvVars } from "./env.schema";

let cached: ResultAsync<EnvVars> | null = null;

export const getEnv = (): ResultAsync<EnvVars> => {
  if (!cached) {
    cached = parseWithSchema(EnvSchema, process.env);
  }

  return cached;
};

export const resetEnvCache = (): void => {
  cached = null;
};
