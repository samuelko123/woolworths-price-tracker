import { ResultAsync } from "@/core/result";

export type Page<T> = {
  total: number;
  items: T[];
};

type FetchPageFn<T> = (pageNumber: number) => ResultAsync<Page<T>>;

type DelayFn = () => Promise<void>;

type FetchAllPagesOptions<T> = {
  fetchPage: FetchPageFn<T>;
  delay?: DelayFn;
};

const fetchAllPagesInternal = async <T>(
  options: FetchAllPagesOptions<T>,
): Promise<T[]> => {
  const { fetchPage, delay = async () => { } } = options;

  let pageNumber = 1;
  let total = 0;
  const allItems: T[] = [];

  while (true) {
    const page = await fetchPage(pageNumber).unwrapOrThrow();
    const { total: pageTotal, items } = page;
    total = pageTotal;
    allItems.push(...items);

    if (allItems.length >= total) break;

    await delay();
    pageNumber++;
  }

  return allItems;
};

export const fetchAllPages = <T>(
  options: FetchAllPagesOptions<T>,
): ResultAsync<T[]> => {
  return ResultAsync.fromPromise(fetchAllPagesInternal(options));
};
