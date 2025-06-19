type DelayRange = {
  min: number;
  max: number;
};

export const randomDelay = async (delayRange: DelayRange): Promise<void> => {
  const { min, max } = delayRange;
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

export const fetchAllPaginated = async <T>(
  fetchPage: (pageNumber: number) => Promise<{ total: number; items: T[] }>,
  options: { delayRange: { min: number; max: number } },
): Promise<T[]> => {
  const { delayRange } = options;

  const allItems: T[] = [];
  let pageNumber = 1;
  let total = 0;
  let fetched = 0;

  do {
    const { total: newTotal, items } = await fetchPage(pageNumber);
    total = newTotal;
    allItems.push(...items);
    fetched += items.length;
    pageNumber++;

    await randomDelay(delayRange);
  } while (fetched < total);

  return allItems;
};
