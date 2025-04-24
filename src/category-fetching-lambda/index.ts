import { fetchCategories } from "./category";

export const handler = async () => {
  await fetchCategories();
};
