import { expectErr, expectOk } from "@/tests/helpers/expectResult";

import { getCategoryQueueUrl } from "./getCategoryQueueUrl";

describe("getCategoryQueueUrl", () => {
  const ORIGINAL_ENV = process.env;
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("returns CATEGORY_QUEUE_URL from environment variables", async () => {
    process.env.CATEGORY_QUEUE_URL = "https://sqs.example.com/queue";

    const result = await getCategoryQueueUrl().toPromise();

    expectOk(result);
    expect(result.value).toBe("https://sqs.example.com/queue");
  });

  it("returns error when CATEGORY_QUEUE_URL is not defined", async () => {
    delete process.env.CATEGORY_QUEUE_URL;

    const result = await getCategoryQueueUrl().toPromise();

    expectErr(result);
    expect(result.error.message).toBe("Missing CATEGORY_QUEUE_URL");
  });
});
