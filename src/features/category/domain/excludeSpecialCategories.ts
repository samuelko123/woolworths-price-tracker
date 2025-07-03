import { type Category } from "./category";

export const filterCategories = (categories: Category[]): Category[] => {
  return categories.filter(
    (category) =>
      category.id !== "specialsgroup" && category.urlName !== "front-of-store",
  );
}; 
