import { dequeueCategory, fetchCategoryProducts, saveProduct } from "./adapters";

export const saveProductsForNextCategory = async (): Promise<void> => {
  const result = await dequeueCategory();
  if (!result) {
    return;
  }

  const { category } = result;
  const products = await fetchCategoryProducts(category);
  for (const product of products) {
    await saveProduct(product);
  }

  const { acknowledge } = result;
  await acknowledge();
};
