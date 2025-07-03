import { type Category } from "./category";
import { filterCategories } from "./excludeSpecialCategories";

describe("excludeSpecialCategories", () => {
  it("excludes specialsgroup and front-of-store", () => {
    const input: Category[] = [
      { id: "specialsgroup", urlName: "weekly-specials", displayName: "Specials" },
      { id: "some-id", urlName: "front-of-store", displayName: "Front of Store" },
      { id: "fresh-id", urlName: "fresh-produce", displayName: "Fresh Produce" },
    ];

    const filtered = filterCategories(input);

    expect(filtered).toEqual([
      { id: "fresh-id", urlName: "fresh-produce", displayName: "Fresh Produce" },
    ]);
  });
});
