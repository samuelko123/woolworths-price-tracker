import { errAsync, okAsync } from "neverthrow";

import { createDynamoDBDocumentClient } from "@/core/dynamodb";
import { expectErr, expectOk } from "@/tests/helpers";

import { saveItem } from "./saveItem";
import { saveProductsWith } from "./saveProducts";
import { mockProduct1, mockProduct2 } from "./saveProducts.test.data";

vi.mock("./saveItem");

describe("saveProductsWith", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("saves all products when all succeed", async () => {
    vi.mocked(saveItem).mockReturnValue(okAsync());

    const client = createDynamoDBDocumentClient();
    const saveProducts = saveProductsWith(client);
    const result = await saveProducts([mockProduct1, mockProduct2]);

    expectOk(result);
    expect(saveItem).toHaveBeenCalledTimes(2);
    expect(saveItem).toHaveBeenCalledWith(client, "products", mockProduct1);
    expect(saveItem).toHaveBeenCalledWith(client, "products", mockProduct2);
  });

  it("stops and returns error on first failed save", async () => {
    const error = new Error("fail");
    vi.mocked(saveItem)
      .mockReturnValueOnce(errAsync(error));

    const client = createDynamoDBDocumentClient();
    const saveProducts = saveProductsWith(client);
    const result = await saveProducts([mockProduct1, mockProduct2]);

    expectErr(result);
    expect(result.error).toBe(error);
    expect(saveItem).toHaveBeenCalledTimes(1);
    expect(saveItem).toHaveBeenCalledWith(client, "products", mockProduct1);
  });

  it("handles empty product list", async () => {
    const client = createDynamoDBDocumentClient();
    const saveProducts = saveProductsWith(client);
    const result = await saveProducts([]);

    expectOk(result);
    expect(saveItem).not.toHaveBeenCalled();
  });
});
