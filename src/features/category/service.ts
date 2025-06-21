import {
  type EnqueueCategories,
  type FetchCategories,
  type PurgeCategoryQueue,
} from "./ports";

export const fetchAndQueueCategories = ({
  fetchCategories,
  purgeCategoryQueue,
  enqueueCategories,
}: {
  fetchCategories: FetchCategories;
  purgeCategoryQueue: PurgeCategoryQueue;
  enqueueCategories: EnqueueCategories;
}): Promise<void> => {
  return (async () => {
    const categories = await fetchCategories();
    const filteredCategories = categories.filter(
      (category) =>
        category.id !== "specialsgroup" && category.urlName !== "front-of-store",
    );

    await purgeCategoryQueue();
    await enqueueCategories(filteredCategories);
  })();
};
