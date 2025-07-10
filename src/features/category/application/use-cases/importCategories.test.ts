import { okAsync } from "neverthrow";

import { importCategories } from "./importCategories";
import { categories, categoriesResponse } from "./importCategories.test.data";

describe("importCategories", () => {
  it("succeeds when all steps succeed", async () => {
    const fetchCategories = vi.fn().mockReturnValue(okAsync(categoriesResponse));
    const purgeCategoryQueue = vi.fn().mockReturnValue(okAsync());
    const sendCategoryMessages = vi.fn().mockReturnValue(okAsync());

    const result = await importCategories({
      fetchCategories,
      purgeCategoryQueue,
      sendCategoryMessages,
    });

    expect(result.isOk()).toBe(true);
    expect(fetchCategories).toHaveBeenCalledOnce();
    expect(purgeCategoryQueue).toHaveBeenCalledOnce();
    expect(sendCategoryMessages).toHaveBeenCalledWith(categories);
  });
});
