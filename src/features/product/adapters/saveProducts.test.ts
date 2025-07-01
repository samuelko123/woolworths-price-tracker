import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

import { expectErr, expectOk } from "@/tests/helpers";

import { saveProducts } from "./saveProducts";
import { mockProduct1, mockProduct2 } from "./saveProducts.test.data";

const client = mockClient(DynamoDBDocumentClient);

describe("saveProducts", () => {
  beforeEach(() => {
    client.reset();
  });

  it("sends one PutCommand per product", async () => {
    client.resolves({});

    const result = await saveProducts([mockProduct1, mockProduct2]);

    expectOk(result);

    const calls = client.calls();
    expect(calls).toHaveLength(2);

    expect(calls[0].args[0]).toBeInstanceOf(PutCommand);
    expect(calls[0].args[0]).toEqual(
      expect.objectContaining({
        input: {
          TableName: "products",
          Item: mockProduct1,
        },
      }),
    );
    expect(calls[1].args[0]).toBeInstanceOf(PutCommand);
    expect(calls[1].args[0]).toEqual(
      expect.objectContaining({
        input: {
          TableName: "products",
          Item: mockProduct2,
        },
      }),
    );
  });

  it("does not send any command when receiving empty array", async () => {
    client.resolves({});

    const result = await saveProducts([]);

    expectOk(result);
    expect(client.calls()).toHaveLength(0);
  });

  it("returns error if any PutCommand fails", async () => {
    client.rejects(new Error("DynamoDB failure"));

    const result = await saveProducts([mockProduct1]);

    expectErr(result);
    expect(result.error.message).toBe("DynamoDB failure");
  });

  it("does not send subsequent products if one fails", async () => {
    client
      .on(PutCommand, {
        TableName: "products",
        Item: mockProduct1,
      })
      .rejects(new Error("Product 1 failed"));

    const result = await saveProducts([mockProduct1, mockProduct2]);

    expectErr(result);
    expect(result.error.message).toBe("Product 1 failed");

    // Only the first call should be made
    const calls = client.calls();
    expect(calls).toHaveLength(1);

    expect(calls[0].args[0]).toBeInstanceOf(PutCommand);
    expect(calls[0].args[0]).toEqual(
      expect.objectContaining({
        input: {
          TableName: "products",
          Item: mockProduct1,
        },
      }),
    );
  });
});
