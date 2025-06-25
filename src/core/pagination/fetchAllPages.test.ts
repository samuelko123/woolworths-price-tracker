import { fetchAllPages } from "./fetchAllPages";

type Item = { id: number };

describe("fetchAllPages", () => {
  it("fetches multiple pages until total is reached", async () => {
    const pages = [
      { total: 5, items: [{ id: 1 }, { id: 2 }] },
      { total: 5, items: [{ id: 3 }, { id: 4 }] },
      { total: 5, items: [{ id: 5 }] },
    ];

    const fetchPage = vi.fn((pageNumber: number) => {
      return Promise.resolve(pages[pageNumber - 1]);
    });

    const delay = vi.fn(() => Promise.resolve());

    const result = await fetchAllPages<Item>({ fetchPage, delay });

    expect(result).toEqual([
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
    const fetchPage = vi.fn(() =>
      Promise.resolve({ total: 0, items: [] }),
    );

    const delay = vi.fn(() => Promise.resolve());

    const result = await fetchAllPages<Item>({ fetchPage, delay });

    expect(result).toEqual([]);
    expect(fetchPage).toHaveBeenCalledTimes(1);
    expect(delay).not.toHaveBeenCalled();
  });

  it("works without delay option", async () => {
    const fetchPage = vi.fn((pageNumber: number) =>
      Promise.resolve({
        total: 2,
        items: [{ id: pageNumber }],
      }),
    );

    const result = await fetchAllPages<Item>({ fetchPage });

    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    expect(fetchPage).toHaveBeenCalledTimes(2);
  });
});
