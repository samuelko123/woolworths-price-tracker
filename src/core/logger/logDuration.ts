import { type Result, type ResultAsync } from "neverthrow";

import { logInfo } from "./logInfo";

export const logDuration = async <T>(label: string, fn: () => ResultAsync<T, Error>): Promise<Result<T, Error>> => {
  logInfo("Function started.", { label });
  const start = Date.now();

  const result = await fn();

  const duration = Date.now() - start;
  logInfo("Function finished.", { label, duration });

  return result;
};
