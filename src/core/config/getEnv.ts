import { EnvSchema, type EnvVars } from "./env.schema";

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
