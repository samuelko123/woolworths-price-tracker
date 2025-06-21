import { type LogDuration } from "../ports";
import { logInfo } from "./logInfo";

export const logDuration: LogDuration = async (label, fn) => {
  logInfo("Function started.", { label });
  const start = Date.now();

  const result = await fn();

  const duration = Date.now() - start;
  logInfo("Function finished.", { label, duration });

  return result;
};
