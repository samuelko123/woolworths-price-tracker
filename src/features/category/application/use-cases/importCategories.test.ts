import { okAsync } from "neverthrow";

import { importCategories } from "./importCategories";

describe("importCategories", () => {
  it("succeeds when all steps succeed", async () => {
    const rawCategories = [{ NodeId: "fruit" }, { NodeId: "veg" }];
    const categories = [{ id: "fruit" }, { id: "veg" }];
    const queueUrl = "https://sqs.example.com/categories";

    const fetchCategories = vi.fn().mockReturnValue(okAsync(rawCategories));
    const parseCategories = vi.fn().mockReturnValue(okAsync(categories));
    const getCategoryQueueUrl = vi.fn().mockReturnValue(okAsync(queueUrl));
    const purgeQueue = vi.fn().mockReturnValue(okAsync());
    const sendCategoryMessages = vi.fn().mockReturnValue(okAsync());

    const result = await importCategories({
      fetchCategories,
      parseCategories,
      getCategoryQueueUrl,
      purgeQueue,
      sendCategoryMessages,
    });

    expect(result.isOk()).toBe(true);
    expect(fetchCategories).toHaveBeenCalledOnce();
    expect(parseCategories).toHaveBeenCalledWith(rawCategories);
    expect(getCategoryQueueUrl).toHaveBeenCalledOnce();
    expect(purgeQueue).toHaveBeenCalledWith(queueUrl);
    expect(sendCategoryMessages).toHaveBeenCalledWith(queueUrl, categories);
  });
});
