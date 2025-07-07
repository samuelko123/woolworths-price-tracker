import { okAsync } from "neverthrow";

import { importCategories } from "./importCategories";
import { categories, categoriesResponse, queueUrl } from "./importCategories.test.data";

describe("importCategories", () => {
  it("succeeds when all steps succeed", async () => {
    const fetchCategories = vi.fn().mockReturnValue(okAsync(categoriesResponse));
    const getCategoryQueueUrl = vi.fn().mockReturnValue(okAsync(queueUrl));
    const purgeQueue = vi.fn().mockReturnValue(okAsync());
    const sendCategoryMessages = vi.fn().mockReturnValue(okAsync());

    const result = await importCategories({
      fetchCategories,
      getCategoryQueueUrl,
      purgeQueue,
      sendCategoryMessages,
    });

    expect(result.isOk()).toBe(true);
    expect(fetchCategories).toHaveBeenCalledOnce();
    expect(getCategoryQueueUrl).toHaveBeenCalledOnce();
    expect(purgeQueue).toHaveBeenCalledWith(queueUrl);
    expect(sendCategoryMessages).toHaveBeenCalledWith(queueUrl, categories);
  });
});
