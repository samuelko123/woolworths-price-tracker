import { okAsync } from "neverthrow";

import { importCategories } from "./importCategories";
import { categories, categoriesResponse } from "./importCategories.test.data";

describe("importCategories", () => {
  it("succeeds when all steps succeed", async () => {
    const purgeCategoryQueue = vi.fn().mockReturnValue(okAsync());
    const fetchCategories = vi.fn().mockReturnValue(okAsync(categoriesResponse));
    const sendCategoryMessages = vi.fn().mockReturnValue(okAsync());

    const result = await importCategories({
      purgeCategoryQueue,
      fetchCategories,
      sendCategoryMessages,
    });

    expect(result.isOk()).toBe(true);
    expect(purgeCategoryQueue).toHaveBeenCalledOnce();
    expect(fetchCategories).toHaveBeenCalledOnce();
    expect(sendCategoryMessages).toHaveBeenCalledWith(categories);
  });
});
