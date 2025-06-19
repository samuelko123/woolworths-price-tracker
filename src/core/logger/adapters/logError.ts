import { type LogError } from "../ports";

/* eslint-disable no-console */
export const logError: LogError = (error) => {
  if (error instanceof Error) {
    console.error({
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
  } else {
    console.error(error);
  }
};
