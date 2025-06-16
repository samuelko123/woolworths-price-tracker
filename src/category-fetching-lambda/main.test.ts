import {
  PurgeQueueCommand,
  SendMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";
import { mockClient } from "aws-sdk-client-mock";

import { main } from "@/src/category-fetching-lambda/main";
import { http, HttpResponse, testServer } from "@/test/server";

import { mockCategoriesResponse } from "./main.test.data";

vi.mock("../shared/logger");

describe("main", () => {
  const OLD_ENV = process.env;
  const sqsMock = mockClient(SQSClient);

  beforeEach(() => {
    process.env = { ...OLD_ENV, CATEGORY_QUEUE_URL: "https://mock-queue-url" };
    sqsMock.reset();
    sqsMock.callsFake(() => {
      return Promise.resolve({ $metadata: { httpStatusCode: 200 } });
    });
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it("runs successfully", async () => {
    testServer.use(
      http.get(
        "https://www.woolworths.com.au/apis/ui/PiesCategoriesWithSpecials",
        () => HttpResponse.json(mockCategoriesResponse, { status: 200 }),
      ),
    );

    await main();

    const calls = sqsMock.calls();
    expect(calls).toHaveLength(2);

    expect(calls[0].args[0]).toBeInstanceOf(PurgeQueueCommand);
    expect(calls[0].args[0]).toEqual(
      expect.objectContaining({
        input: {
          QueueUrl: process.env.CATEGORY_QUEUE_URL,
        },
      }),
    );

    expect(calls[1].args[0]).toBeInstanceOf(SendMessageCommand);
    expect(calls[1].args[0]).toEqual(
      expect.objectContaining({
        input: {
          QueueUrl: process.env.CATEGORY_QUEUE_URL,
          MessageBody: JSON.stringify({
            id: mockCategoriesResponse.Categories[1].NodeId,
            level: mockCategoriesResponse.Categories[1].NodeLevel,
            urlName: mockCategoriesResponse.Categories[1].UrlFriendlyName,
            displayName: mockCategoriesResponse.Categories[1].Description,
          }),
        },
      }),
    );
  });
});
