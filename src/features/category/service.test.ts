import { fetchAndQueueCategories } from "./service";
import { mockCategories } from "./service.test.data";

describe("fetchAndQueueCategories", () => {
  it("runs successfully", async () => {
    const fetchCategories = vi.fn().mockResolvedValue(mockCategories);
    const purgeCategoryQueue = vi.fn().mockResolvedValue(null);
    const enqueueCategories = vi.fn().mockResolvedValue(null);

    await fetchAndQueueCategories({
      fetchCategories,
      purgeCategoryQueue,
      enqueueCategories,
    });

    expect(fetchCategories).toHaveBeenCalledTimes(1);
    expect(purgeCategoryQueue).toHaveBeenCalledTimes(1);
    expect(enqueueCategories).toHaveBeenCalledTimes(1);
  });
});
