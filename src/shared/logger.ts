export const logger = {
  debug: (data: object | string) => {
    if (typeof data === "string") {
      console.debug({
        message: data
      });
    } else {
      console.debug(data);
    }
  },
  info: (data: object | string) => {
    if (typeof data === "string") {
      console.info({
        message: data
      });
    } else {
      console.info(data);
    }
  },
  error: (error: unknown) => {
    if (error instanceof Error) {
      console.error({
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    } else {
      console.error(error);
    }
  },
};
