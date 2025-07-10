/* eslint-disable no-console */
export const logInfo = (message: string, metadata?: Record<string, unknown>) => {
  console.info({
    message,
    ...metadata,
  });
};
