import { errAsync, okAsync } from "neverthrow";

import { sendMessage } from "@/core/sqs";
import { expectErr, expectOk } from "@/tests/helpers";

import { sendMessages } from "./sendMessages";

vi.mock("@/core/sqs");

describe("sendMessages", () => {
  const queueUrl = "https://test-queue-url";
  const item1 = { id: "1", name: "First" };
  const item2 = { id: "2", name: "Second" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends all messages successfully", async () => {
    vi.mocked(sendMessage).mockReturnValue(okAsync());

    const result = await sendMessages(queueUrl, [item1, item2]);

    expectOk(result);
    expect(sendMessage).toHaveBeenCalledTimes(2);

    expect(sendMessage).toHaveBeenNthCalledWith(1, queueUrl, item1);
    expect(sendMessage).toHaveBeenNthCalledWith(2, queueUrl, item2);
  });

  it("stops and returns error on first failure", async () => {
    const error = new Error("Send failed");
    vi.mocked(sendMessage)
      .mockReturnValueOnce(errAsync(error));

    const result = await sendMessages(queueUrl, [item1, item2]);

    expectErr(result);
    expect(result.error).toEqual(error);
    expect(sendMessage).toHaveBeenCalledTimes(1);
    expect(sendMessage).toHaveBeenCalledWith(queueUrl, item1);
  });

  it("handles empty item list", async () => {
    const result = await sendMessages(queueUrl, []);

    expectOk(result);
    expect(sendMessage).not.toHaveBeenCalled();
  });
});
