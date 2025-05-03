export const logger = {
  info: (data: object) => {
    console.info(data);
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
