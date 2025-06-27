import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

import { expectErr, expectOk } from "@/tests/helpers/expectResult";

import { saveProduct } from "./saveProduct";
import { mockProduct } from "./saveProduct.test.data";

const client = mockClient(DynamoDBDocumentClient);

describe("saveProduct", () => {
  beforeEach(() => {
    client.reset();
  });

  it("sends a PutCommand", async () => {
    client.resolves({});

    const result = await saveProduct(mockProduct).toPromise();

    expectOk(result);
    expect(client.calls()).toHaveLength(1);
    expect(client.commandCalls(PutCommand)[0].args[0].input).toEqual({
      TableName: "products",
      Item: mockProduct,
    });
  });

  it("returns error if PutCommand fails", async () => {
    client.rejects(new Error("DynamoDB failure"));

    const result = await saveProduct(mockProduct).toPromise();

    expectErr(result);
    expect(result.error.message).toBe("DynamoDB failure");
  });
});
