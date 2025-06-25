type Page<T> = {
  total: number;
  items: T[];
};

type FetchPageFn<T> = (pageNumber: number) => Promise<Page<T>>;

type DelayFn = () => Promise<void>;

type FetchAllPagesOptions<T> = {
  fetchPage: FetchPageFn<T>;
  delay?: DelayFn;
};

export const fetchAllPages = async <T>(
  options: FetchAllPagesOptions<T>,
): Promise<T[]> => {
  const {
    fetchPage,
    delay = async () => { },
  } = options;

  let pageNumber = 1;
  let total = 0;
  let allItems: T[] = [];

  while (true) {
    const { total: newTotal, items } = await fetchPage(pageNumber);
    total = newTotal;
    allItems.push(...items);

    if (allItems.length >= total) break;
    await delay();

    pageNumber++;
  }

  return allItems;
};
