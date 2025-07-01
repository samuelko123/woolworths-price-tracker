import { okAsync } from "neverthrow";

import { type FilterCategories } from "../ports";

export const filterCategories: FilterCategories = (categories) => {
  const filtered = categories.filter(
    (category) =>
      category.id !== "specialsgroup" && category.urlName !== "front-of-store",
  );

  return okAsync(filtered);
}; 
