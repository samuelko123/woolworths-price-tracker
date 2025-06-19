/* eslint-disable no-console */
export const logger = {
  info: (data: object | string) => {
    if (typeof data === "string") {
      console.info({
        message: data,
      });
    } else {
      console.info(data);
    }
  },
};
