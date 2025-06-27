import { expectErr, expectOk } from "@/tests/helpers/expectResult";

import { ResultAsync } from "../result";
import { fetchAllPages } from "./fetchAllPages";

describe("fetchAllPages", () => {
  it("fetches multiple pages until total is reached", async () => {
    const pages = [
      { total: 5, items: [{ id: 1 }, { id: 2 }] },
      { total: 5, items: [{ id: 3 }, { id: 4 }] },
      { total: 5, items: [{ id: 5 }] },
    ];

    const fetchPage = vi.fn((pageNumber: number) => {
      return ResultAsync.ok(pages[pageNumber - 1]);
    });

    const delay = vi.fn(() => Promise.resolve());

    const result = await fetchAllPages({ fetchPage, delay }).toPromise();

    expectOk(result);
    expect(result.value).toEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
    ]);

    expect(fetchPage).toHaveBeenCalledTimes(3);
    expect(delay).toHaveBeenCalledTimes(2); // Only between pages 1→2 and 2→3
  });

  it("stops immediately if first page has total 0", async () => {
    const fetchPage = vi.fn(() => {
      return ResultAsync.ok({ total: 0, items: [] });
    });

    const delay = vi.fn(() => Promise.resolve());

    const result = await fetchAllPages({ fetchPage, delay }).toPromise();

    expectOk(result);
    expect(result.value).toEqual([]);
    expect(fetchPage).toHaveBeenCalledTimes(1);
    expect(delay).not.toHaveBeenCalled();
  });

  it("works without delay option", async () => {
    const fetchPage = vi.fn((pageNumber: number) => {
      return ResultAsync.ok({
        total: 2,
        items: [{ id: pageNumber }],
      });
    });

    const result = await fetchAllPages({ fetchPage }).toPromise();

    expectOk(result);
    expect(result.value).toEqual([{ id: 1 }, { id: 2 }]);
    expect(fetchPage).toHaveBeenCalledTimes(2);
  });

  it("fails if fetchPage returns an error", async () => {
    const error = new Error("Failed to fetch page");

    const fetchPage = vi.fn(() => {
      return ResultAsync.err(error);
    });

    const delay = vi.fn(() => Promise.resolve());

    const result = await fetchAllPages({ fetchPage, delay }).toPromise();

    expectErr(result);
    expect(result.error).toBe(error);

    expect(fetchPage).toHaveBeenCalledTimes(1);
    expect(delay).not.toHaveBeenCalled();
  });
});
