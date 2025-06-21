import { enqueueCategories, fetchCategories, purgeCategoryQueue } from "./adapters";

export const fetchAndQueueCategories = async (): Promise<void> => {
  const categories = await fetchCategories();
  const filteredCategories = categories.filter(
    (category) => category.id !== "specialsgroup" && category.urlName !== "front-of-store",
  );
  await purgeCategoryQueue();
  await enqueueCategories(filteredCategories);
};
