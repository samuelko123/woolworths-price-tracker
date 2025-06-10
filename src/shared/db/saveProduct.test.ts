import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach,describe, expect, it } from "vitest";

import { saveProduct } from "./saveProduct";
import { mockProduct } from "./saveProduct.test.data";

vi.mock("../../shared/logger");

const client = mockClient(DynamoDBDocumentClient);

describe("saveProduct", () => {
  beforeEach(() => {
    client.reset();
  });

  it("sends a PutCommand", async () => {
    client.resolves({});

    await saveProduct(mockProduct);

    expect(client.calls()).toHaveLength(1);
    expect(client.commandCalls(PutCommand)[0].args[0].input).toEqual({
      TableName: "products",
      Item: mockProduct,
    });
  });

  it("throws if PutCommand fails", async () => {
    client.rejects(new Error("DynamoDB failure"));

    await expect(() => saveProduct(mockProduct)).rejects.toThrow("DynamoDB failure");
  });
});
