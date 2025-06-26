export const randomDelay = async ({ min, max }: { min: number, max: number }): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
};
