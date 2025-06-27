import { ResultAsync } from "@/core/result";
import { type Product } from "@/domain";
import { expectOk } from "@/tests/helpers/expectResult";

import { processNextCategory } from "./processNextCategory";
import { mockCategory, mockMessage, mockProduct, mockQueueUrl } from "./processNextCategory.test.data";

describe("saveProductsForNextCategory", () => {
  it("calls all ports in sequence and acknowledges message", async () => {
    const mockProducts: Product[] = [mockProduct];

    const getCategoryQueueUrl = vi.fn().mockReturnValue(ResultAsync.ok(mockQueueUrl));
    const receiveMessage = vi.fn().mockReturnValue(ResultAsync.ok(mockMessage));
    const parseCategory = vi.fn().mockReturnValue(ResultAsync.ok(mockCategory));
    const fetchProducts = vi.fn().mockReturnValue(ResultAsync.ok(mockProducts));
    const saveProducts = vi.fn().mockReturnValue(ResultAsync.ok(undefined));
    const acknowledgeMessage = vi.fn().mockReturnValue(ResultAsync.ok(undefined));

    const result = await processNextCategory({
      getCategoryQueueUrl,
      receiveMessage,
      parseCategory,
      fetchProducts,
      saveProducts,
      acknowledgeMessage,
    }).toPromise();

    // Assert
    expectOk(result);
    expect(getCategoryQueueUrl).toHaveBeenCalledOnce();
    expect(receiveMessage).toHaveBeenCalledWith(mockQueueUrl);
    expect(parseCategory).toHaveBeenCalledWith(mockMessage);
    expect(fetchProducts).toHaveBeenCalledWith(mockCategory);
    expect(saveProducts).toHaveBeenCalledWith(mockProducts);
    expect(acknowledgeMessage).toHaveBeenCalledWith(mockMessage);
  });
});
