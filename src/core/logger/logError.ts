/* eslint-disable no-console */
export const logError = (error: unknown) => {
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
