import { errAsync, okAsync } from "neverthrow";

import { expectErr, expectOk } from "@/tests/helpers";

import { sendCategoryMessages } from "./sendCategoryMessages";
import { sendMessage } from "./sendMessage";

vi.mock("./sendMessage");

describe("sendCategoryMessages", () => {
  const queueUrl = "https://test-queue-url";
  const category1 = { id: "123", displayName: "Fruit", urlName: "fruit" };
  const category2 = { id: "456", displayName: "Vegetables", urlName: "veg" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends all messages successfully", async () => {
    vi.mocked(sendMessage).mockReturnValue(okAsync());

    const result = await sendCategoryMessages(queueUrl, [category1, category2]);

    expectOk(result);
    expect(sendMessage).toHaveBeenCalledTimes(2);

    expect(sendMessage).toHaveBeenNthCalledWith(1, queueUrl, category1);
    expect(sendMessage).toHaveBeenNthCalledWith(2, queueUrl, category2);
  });

  it("stops and returns error on first failure", async () => {
    const error = new Error("Send failed");
    vi.mocked(sendMessage)
      .mockReturnValueOnce(errAsync(error));

    const result = await sendCategoryMessages(queueUrl, [category1, category2]);

    expectErr(result);
    expect(result.error).toEqual(error);
    expect(sendMessage).toHaveBeenCalledTimes(1);
    expect(sendMessage).toHaveBeenCalledWith(queueUrl, category1);
  });

  it("handles empty item list", async () => {
    const result = await sendCategoryMessages(queueUrl, []);

    expectOk(result);
    expect(sendMessage).not.toHaveBeenCalled();
  });
});
