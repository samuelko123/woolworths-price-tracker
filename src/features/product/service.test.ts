import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

import { http, HttpResponse, testServer } from "@/tests/helper/msw";

import { saveProductsForNextCategory } from "./service";
import { mockCategoryProductsResponse } from "./service.test.data";

vi.mock("@/logger");

describe("main", () => {
  const OLD_ENV = process.env;
  const sqsMock = mockClient(SQSClient);
  const dbMock = mockClient(DynamoDBDocumentClient);

  beforeEach(() => {
    process.env = { ...OLD_ENV, CATEGORY_QUEUE_URL: "https://mock-queue-url" };
  });
  afterEach(() => {
    process.env = OLD_ENV;
  });

  beforeEach(() => {
    sqsMock.reset();
    sqsMock.on(ReceiveMessageCommand).resolves({
      Messages: [
        {
          Body: JSON.stringify({
            id: "123",
            level: 1,
            displayName: "Fruit",
            urlName: "fruit",
          }),
          ReceiptHandle: "abc-receipt",
        },
      ],
    });

    dbMock.on(PutCommand).resolves({});
  });

  beforeEach(() => {
    testServer.use(
      http.get("https://www.woolworths.com.au/", () =>
        HttpResponse.text("<html></html>", { status: 200 }),
      ),
    );

    testServer.use(
      http.post("https://www.woolworths.com.au/apis/ui/browse/category", () =>
        HttpResponse.json(mockCategoryProductsResponse, { status: 200 }),
      ),
    );
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("runs successfully", async () => {
    const promise = saveProductsForNextCategory();
    await vi.advanceTimersByTimeAsync(2000);
    await promise;

    const calls = sqsMock.calls();
    expect(calls).toHaveLength(2);

    expect(calls[0].args[0]).toBeInstanceOf(ReceiveMessageCommand);
    expect(calls[0].args[0]).toEqual(
      expect.objectContaining({
        input: {
          MaxNumberOfMessages: 1,
          QueueUrl: process.env.CATEGORY_QUEUE_URL,
          VisibilityTimeout: 30,
          WaitTimeSeconds: 5,
        },
      }),
    );

    expect(calls[1].args[0]).toBeInstanceOf(DeleteMessageCommand);
    expect(calls[1].args[0]).toEqual(
      expect.objectContaining({
        input: {
          QueueUrl: process.env.CATEGORY_QUEUE_URL,
          ReceiptHandle: "abc-receipt",
        },
      }),
    );

    const dbCalls = dbMock.calls();
    expect(dbCalls).toHaveLength(2);

    expect(dbCalls[0].args[0]).toBeInstanceOf(PutCommand);
    expect(dbCalls[0].args[0].input).toEqual({
      TableName: "products",
      Item: {
        barcode: "1234567890123",
        sku: "123456",
        name: "Product 1",
        packageSize: "500g",
        imageUrl: "https://example.com/image1.jpg",
        price: 10.99,
      },
    });

    expect(dbCalls[1].args[0]).toBeInstanceOf(PutCommand);
    expect(dbCalls[1].args[0].input).toEqual({
      TableName: "products",
      Item: {
        barcode: "7890123456789",
        sku: "789012",
        name: "Product 2",
        packageSize: "1kg",
        imageUrl: "https://example.com/image2.jpg",
        price: 15.99,
      },
    });
  });
});
