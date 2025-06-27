import { z } from "zod";

import { ProductSchema } from "@/domain";

export const WoolworthsCategoryResponseSchema = z
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
      items: dto.Bundles
        .flatMap((bundle) => bundle.Products)
        .filter((product) => !!product.barcode),
    };
  });

export type WoolworthsCategoryResponse = z.infer<typeof WoolworthsCategoryResponseSchema>;
