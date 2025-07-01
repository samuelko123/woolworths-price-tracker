import { type Category } from "@/domain";
import { expectOk } from "@/tests/helpers";

import { filterCategories } from "./filterCategories";

describe("filterCategories", () => {
  it("excludes specialsgroup and front-of-store", async () => {
    const input: Category[] = [
      { id: "specialsgroup", urlName: "weekly-specials", displayName: "Specials" },
      { id: "some-id", urlName: "front-of-store", displayName: "Front of Store" },
      { id: "fresh-id", urlName: "fresh-produce", displayName: "Fresh Produce" },
    ];

    const result = await filterCategories(input);

    expectOk(result);
    expect(result.value).toEqual([
      { id: "fresh-id", urlName: "fresh-produce", displayName: "Fresh Produce" },
    ]);
  });
});
