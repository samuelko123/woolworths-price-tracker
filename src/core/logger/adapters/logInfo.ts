import { LogInfo } from "../ports";

/* eslint-disable no-console */
export const logInfo: LogInfo = (message, metadata) => {
  console.info({
    message,
    ...metadata,
  });
};
