import { dequeueCategory, fetchProducts, saveProduct } from "./adapters";

export const saveProductsForNextCategory = (): Promise<void> => {
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
