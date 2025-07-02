import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

import { expectErr, expectOk } from "@/tests/helpers";

import { createDynamoDBDocumentClient } from "./createDocumentClient";
import { saveItem } from "./saveItem";

describe("saveItem", () => {
  const tableName = "TestTable";
  const item = { id: "abc", name: "MyItem" };

  const client = createDynamoDBDocumentClient();
  const stub = mockClient(client);
  beforeEach(() => {
    stub.reset();
  });

  it("sends a PutCommand", async () => {
    stub.on(PutCommand).resolves({});

    const result = await saveItem(client, tableName, item);

    expectOk(result);

    const calls = stub.calls();
    expect(calls).toHaveLength(1);
    expect(calls[0].args[0]).toBeInstanceOf(PutCommand);
    expect(calls[0].args[0].input).toEqual({
      TableName: tableName,
      Item: item,
    });
  });

  it("returns error when PutCommand fails", async () => {
    stub.on(PutCommand).resolves({});

    const error = new Error("DynamoDB failure");
    stub.rejects(error);

    const result = await saveItem(client, tableName, item);

    expectErr(result);
    expect(result.error).toBe(error);
  });
});
