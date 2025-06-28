import { ZodError } from "zod";

import { expectErr, expectOk } from "@/tests/helpers/expectResult";

import { parseCategory } from "./parseCategory";
import { mockCategory, mockSqsMessage } from "./parseCategory.test.data";

describe("parseCategory", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns parsed category", async () => {
    const result = await parseCategory(mockSqsMessage).toPromise();

    expectOk(result);
    expect(result.value).toEqual(mockCategory);
  });

  it("returns error if category message schema is invalid", async () => {
    const invalidMessage = {
      ...mockSqsMessage,
      body: "invalid json",
    };

    const result = await parseCategory(invalidMessage).toPromise();

    expectErr(result);
    expect(result.error).toBeInstanceOf(ZodError);
    expect(result.error.message).toContain("Invalid JSON string");
  });
});
