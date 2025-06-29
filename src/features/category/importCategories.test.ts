import { okAsync } from "neverthrow";

import { importCategories } from "./importCategories";

describe("importCategories", () => {
  it("succeeds when all steps succeed", async () => {
    const categories = [{ id: "fruit" }, { id: "veg" }];
    const queueUrl = "https://sqs.example.com/categories";

    const fetchCategories = vi.fn().mockReturnValue(okAsync("raw-data"));
    const parseCategories = vi.fn().mockReturnValue(okAsync(categories));
    const filterCategories = vi.fn().mockReturnValue(okAsync(categories));
    const getCategoryQueueUrl = vi.fn().mockReturnValue(okAsync(queueUrl));
    const purgeQueue = vi.fn().mockReturnValue(okAsync());
    const sendMessages = vi.fn().mockReturnValue(okAsync());

    const result = await importCategories({
      fetchCategories,
      parseCategories,
      filterCategories,
      getCategoryQueueUrl,
      purgeQueue,
      sendMessages,
    });

    expect(result.isOk()).toBe(true);
    expect(fetchCategories).toHaveBeenCalledOnce();
    expect(parseCategories).toHaveBeenCalledWith("raw-data");
    expect(filterCategories).toHaveBeenCalledWith(categories);
    expect(getCategoryQueueUrl).toHaveBeenCalledOnce();
    expect(purgeQueue).toHaveBeenCalledWith(queueUrl);
    expect(sendMessages).toHaveBeenCalledWith(queueUrl, categories);
  });
});
