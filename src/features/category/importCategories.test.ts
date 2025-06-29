import { importCategories } from "./importCategories";
import { mockCategories } from "./importCategories.test.data";

describe("importCategories", () => {
  it("runs successfully", async () => {
    const fetchCategories = vi.fn().mockResolvedValue(mockCategories);
    const purgeCategoryQueue = vi.fn().mockResolvedValue(null);
    const enqueueCategories = vi.fn().mockResolvedValue(null);

    await importCategories({
      fetchCategories,
      purgeCategoryQueue,
      enqueueCategories,
    });

    expect(fetchCategories).toHaveBeenCalledTimes(1);
    expect(purgeCategoryQueue).toHaveBeenCalledTimes(1);
    expect(enqueueCategories).toHaveBeenCalledTimes(1);
  });
});
