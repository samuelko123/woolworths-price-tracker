import {
  type DequeueCategory,
  type FetchProductsByCategory,
  type SaveProduct,
} from "./ports";

export const saveProductsForNextCategory = ({
  dequeueCategory,
  fetchProductsByCategory,
  saveProduct,
}: {
  dequeueCategory: DequeueCategory;
  fetchProductsByCategory: FetchProductsByCategory;
  saveProduct: SaveProduct;
}): Promise<void> => {
  return (async () => {
    const result = await dequeueCategory();
    if (!result.success) throw result.error;

    const { category, acknowledge } = result.value;
    const products = await fetchProductsByCategory(category);

    for (const product of products) {
      await saveProduct(product);
    }

    await acknowledge();
  })();
};
