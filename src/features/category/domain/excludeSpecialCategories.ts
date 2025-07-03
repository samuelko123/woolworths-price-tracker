import { type Category } from "./category";

const isSpecialCategory = (category: Category): boolean => {
  return category.id === "specialsgroup" || category.urlName === "front-of-store";
};

export const filterCategories = (categories: Category[]): Category[] => {
  return categories.filter((category) => !isSpecialCategory(category));
}; 
