import { ZodError } from "zod";

import { expectErr, expectOk } from "@/tests/helpers";

import { parseCategories } from "./parseCategories";
import { mockCategoriesResponse } from "./parseCategories.test.data";

describe("parseCategories", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns parsed category", async () => {
    const result = await parseCategories(mockCategoriesResponse);

    expectOk(result);
    expect(result.value).toEqual([
      {
        id: "specialsgroup",
        urlName: "specials",
        displayName: "Specials",
      },
    ]);
  });

  it("returns error if categories response is invalid", async () => {
    const invalidResponse = "not a json";

    const result = await parseCategories(invalidResponse);

    expectErr(result);
    expect(result.error).toBeInstanceOf(ZodError);
    expect(result.error.message).toContain("Expected object, received string");
  });
});
