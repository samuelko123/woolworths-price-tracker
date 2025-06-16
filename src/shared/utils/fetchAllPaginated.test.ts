import { fetchAllPaginated } from "@/src/shared/utils/fetchAllPaginated";

describe("fetchAllPaginated", () => {
  it("fetches all items from a single page", async () => {
    const fetchPage = vi.fn().mockResolvedValue({
      total: 2,
      items: ["item1", "item2"],
    });

    const result = await fetchAllPaginated(fetchPage, { delayRange: { min: 0, max: 0 } });

    expect(result).toEqual(["item1", "item2"]);
    expect(fetchPage).toHaveBeenCalledTimes(1);
    expect(fetchPage).toHaveBeenCalledWith(1);
  });

  it("fetches all items from multiple pages", async () => {
    const fetchPage = vi
      .fn()
      .mockImplementation((pageNumber: number) => {
        if (pageNumber === 1) {
          return Promise.resolve({ total: 4, items: ["item1", "item2"] });
        } else if (pageNumber === 2) {
          return Promise.resolve({ total: 4, items: ["item3", "item4"] });
        }
        return Promise.resolve({ total: 4, items: [] });
      });

    const result = await fetchAllPaginated(fetchPage, { delayRange: { min: 0, max: 0 } });

    expect(result).toEqual(["item1", "item2", "item3", "item4"]);
    expect(fetchPage).toHaveBeenCalledTimes(2);
    expect(fetchPage).toHaveBeenCalledWith(1);
    expect(fetchPage).toHaveBeenCalledWith(2);
  });

  it("returns empty array when no items are fetched", async () => {
    const fetchPage = vi.fn().mockResolvedValue({ total: 0, items: [] });

    const result = await fetchAllPaginated(fetchPage, { delayRange: { min: 0, max: 0 } });

    expect(result).toEqual([]);
    expect(fetchPage).toHaveBeenCalledTimes(1);
  });

  it("handles uneven pages", async () => {
    const fetchPage = vi.fn()
      .mockImplementation((page: number) => {
        if (page === 1) return Promise.resolve({ total: 5, items: ["a", "b"] });
        if (page === 2) return Promise.resolve({ total: 5, items: ["c", "d"] });
        if (page === 3) return Promise.resolve({ total: 5, items: ["e"] });
        return Promise.resolve({ total: 5, items: [] });
      });

    const result = await fetchAllPaginated(fetchPage, { delayRange: { min: 0, max: 0 } });

    expect(result).toEqual(["a", "b", "c", "d", "e"]);
    expect(fetchPage).toHaveBeenCalledTimes(3);
  });
});

describe("fetchAllPaginated - random delay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(global.Math, "random").mockReturnValue(0.5); // midpoint of delay
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("waits the expected delay between page fetches", async () => {
    const fetchPage = vi.fn()
      .mockImplementation((page: number) => {
        if (page === 1) return Promise.resolve({ total: 4, items: ["a", "b"] });
        if (page === 2) return Promise.resolve({ total: 4, items: ["c", "d"] });
        return Promise.resolve({ total: 4, items: [] });
      });

    const resultPromise = fetchAllPaginated(fetchPage, {
      delayRange: { min: 100, max: 300 },
    });

    expect(fetchPage).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(200);
    expect(fetchPage).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(200);

    const items = await resultPromise;
    expect(items).toEqual(["a", "b", "c", "d"]);
  });
});
