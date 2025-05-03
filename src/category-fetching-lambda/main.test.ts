import { http, HttpResponse, testServer } from "../../test/server";
import { mockCategoriesResponse } from "./apiClient.test.data";
import { mockClient } from "aws-sdk-client-mock";
import { SQSClient } from "@aws-sdk/client-sqs";
import { main } from "./main";

describe("main", () => {
  const OLD_ENV = process.env;
  const sqsMock = mockClient(SQSClient);

  beforeEach(() => {
    process.env = { ...OLD_ENV, CATEGORY_QUEUE_URL: "https://mock-queue-url" };
    sqsMock.reset();
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it("runs successfully", async () => {
    testServer.use(
      http.get(
        "https://www.woolworths.com.au/apis/ui/PiesCategoriesWithSpecials",
        () => HttpResponse.json(mockCategoriesResponse, { status: 200 })
      )
    );

    await main();

    expect(sqsMock.calls()).toHaveLength(1);
    expect(sqsMock.call(0).args[0].input).toEqual({
      QueueUrl: process.env.CATEGORY_QUEUE_URL,
      MessageBody: JSON.stringify({
        id: mockCategoriesResponse.Categories[0].NodeId,
        level: mockCategoriesResponse.Categories[0].NodeLevel,
        urlName: mockCategoriesResponse.Categories[0].UrlFriendlyName,
        displayName: mockCategoriesResponse.Categories[0].Description,
      }),
    });
  });
});
