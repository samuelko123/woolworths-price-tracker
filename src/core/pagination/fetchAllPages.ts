import { err, ok, ResultAsync } from "@/core/result";

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

export const fetchAllPages = <T>(
  options: FetchAllPagesOptions<T>,
): ResultAsync<T[]> => {
  const { fetchPage, delay = async () => { } } = options;

  return fetchPage(1)
    .flatMap(({ total, items: firstItems }) => {
      const allItems = [...firstItems];

      const fetchRemaining = async () => {
        for (let page = 2; allItems.length < total; page++) {
          await delay();

          const result = await fetchPage(page).unwrap();
          if (!result.success) return err(result.error);

          allItems.push(...result.value.items);
        }

        return ok(allItems);
      };

      return ResultAsync.from(fetchRemaining());
    });
};
