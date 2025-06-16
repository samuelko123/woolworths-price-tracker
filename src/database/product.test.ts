import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

import { saveProduct } from "./product";
import { mockProduct } from "./product.test.data";

vi.mock("@/logger");

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
