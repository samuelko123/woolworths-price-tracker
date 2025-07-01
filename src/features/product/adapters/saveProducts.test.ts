import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

import { createDocumentClient } from "@/core/dynamodb";
import { expectErr, expectOk } from "@/tests/helpers";

import { createSaveProducts } from "./saveProducts";
import { mockProduct1, mockProduct2 } from "./saveProducts.test.data";

describe("saveProducts", () => {
  const tableName = "products";

  const client = createDocumentClient();
  const stub = mockClient(client);

  const products = [mockProduct1, mockProduct2];

  beforeEach(() => {
    stub.reset();
  });

  it("sends one PutCommand per product", async () => {
    stub.on(PutCommand).resolves({});

    const saveProducts = createSaveProducts(client);
    const result = await saveProducts(products);

    expectOk(result);

    const calls = stub.calls();
    expect(calls).toHaveLength(2);

    expect(calls[0].args[0]).toBeInstanceOf(PutCommand);
    expect(calls[0].args[0].input).toEqual({
      TableName: tableName,
      Item: mockProduct1,
    });

    expect(calls[1].args[0]).toBeInstanceOf(PutCommand);
    expect(calls[1].args[0].input).toEqual({
      TableName: tableName,
      Item: mockProduct2,
    });
  });

  it("does not send any command when receiving empty array", async () => {
    stub.resolves({});

    const saveProducts = createSaveProducts(client);
    const result = await saveProducts([]);

    expectOk(result);
    expect(stub.calls()).toHaveLength(0);
  });

  it("returns error if any PutCommand fails", async () => {
    const error = new Error("DynamoDB failure");
    stub.rejects(error);

    const saveProducts = createSaveProducts(client);
    const result = await saveProducts([mockProduct1]);

    expectErr(result);
    expect(result.error).toBe(error);
  });

  it("does not send subsequent products if one fails", async () => {
    stub
      .on(PutCommand)
      .rejects(new Error("Product 1 failed"));

    const saveProducts = createSaveProducts(client);
    const result = await saveProducts([mockProduct1, mockProduct2]);

    expectErr(result);
    expect(result.error.message).toBe("Product 1 failed");

    const calls = stub.calls();
    expect(calls).toHaveLength(1);

    expect(calls[0].args[0]).toBeInstanceOf(PutCommand);
    expect(calls[0].args[0].input).toEqual({
      TableName: tableName,
      Item: mockProduct1,
    });
  });
});
