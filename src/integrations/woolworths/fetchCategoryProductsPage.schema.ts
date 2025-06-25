import { z } from "zod";

import { ProductSchema } from "@/domain";

export const CategoryProductsDTOSchema = z
  .object({
    TotalRecordCount: z.number(),
    Bundles: z.array(
      z.object({
        Products: z.array(ProductSchema),
      }),
    ),
  })
  .transform((dto) => {
    return {
      total: dto.TotalRecordCount,
      products: dto.Bundles
        .flatMap((bundle) => bundle.Products)
        .filter((product) => !!product.barcode),
    };
  });
