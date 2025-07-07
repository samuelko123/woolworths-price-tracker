import { err, ok, type Result, ResultAsync } from "neverthrow";

export type Page = {
  total: number;
  items: unknown[];
};

type FetchPageFn = (pageNumber: number) => ResultAsync<Page, Error>;
type DelayFn = () => Promise<void>;

type FetchAllPagesOptions = {
  fetchPage: FetchPageFn;
  delay?: DelayFn;
};

export const fetchAllPages = (
  options: FetchAllPagesOptions,
): ResultAsync<unknown[], Error> => {
  const { fetchPage, delay = async () => { } } = options;

  return fetchPage(1).andThen(({ total, items: firstItems }) => {
    const allItems = [...firstItems];

    const fetchRemaining = async (): Promise<Result<unknown[], Error>> => {
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
