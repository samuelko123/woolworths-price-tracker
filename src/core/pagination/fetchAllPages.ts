import { err, ok, type Result, ResultAsync } from "neverthrow";

export type Page<T> = {
  total: number;
  items: T[];
};

type FetchPageFn<T> = (pageNumber: number) => ResultAsync<Page<T>, Error>;
type DelayFn = () => Promise<void>;

type FetchAllPagesOptions<T> = {
  fetchPage: FetchPageFn<T>;
  delay?: DelayFn;
};

export const fetchAllPages = <T>(
  options: FetchAllPagesOptions<T>,
): ResultAsync<T[], Error> => {
  const { fetchPage, delay = async () => { } } = options;

  return fetchPage(1).andThen(({ total, items: firstItems }) => {
    const allItems = [...firstItems];

    const fetchRemaining = async (): Promise<Result<T[], Error>> => {
      for (let page = 2; allItems.length < total; page++) {
        await delay();

        const result = await fetchPage(page);
        if (result.isErr()) return err(result.error);

        allItems.push(...result.value.items);
      }

      return ok(allItems);
    };

    return new ResultAsync(fetchRemaining());
  });
};
