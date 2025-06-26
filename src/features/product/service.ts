import {
  type DequeueCategory,
  type FetchProducts,
  type SaveProduct,
} from "./ports";

export const saveProductsForNextCategory = ({
  dequeueCategory,
  fetchProducts,
  saveProduct,
}: {
  dequeueCategory: DequeueCategory;
  fetchProducts: FetchProducts;
  saveProduct: SaveProduct;
}): Promise<void> => {
  return (async () => {
    const result = await dequeueCategory();
    if (!result.success) throw result.error;
    const { category, acknowledge } = result.value;

    const products = await fetchProducts(category);
    if (!products.success) throw products.error;

    for (const product of products.value) {
      await saveProduct(product);
    }

    await acknowledge();
  })();
};
