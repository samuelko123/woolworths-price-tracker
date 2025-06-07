export const fetchAllPaginated = async <T>(
  fetchPage: (pageNumber: number) => Promise<{ total: number; items: T[] }>,
): Promise<T[]> => {
  const allItems: T[] = [];
  let pageNumber = 1;
  let total = 0;
  let fetched = 0;

  do {
    const { total: newTotal, items } = await fetchPage(pageNumber);
    total = newTotal;
    allItems.push(...items);
    fetched += items.length;
    pageNumber++;
  } while (fetched < total);

  return allItems;
}
