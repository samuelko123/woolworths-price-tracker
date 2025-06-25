import { z } from "zod";

import { ProductSchema } from "@/domain";

export const WoolworthsCategoryPayloadSchema = z.object({
  categoryId: z.string(),
  pageNumber: z.number(),
  pageSize: z.number(),
  sortType: z.string(),
  url: z.string(),
  location: z.string(),
  formatObject: z.string(),
  isSpecial: z.boolean(),
  isBundle: z.boolean(),
  isMobile: z.boolean(),
  filters: z.array(z.unknown()),
  token: z.string(),
  gpBoost: z.number(),
  isHideUnavailableProducts: z.boolean(),
  isRegisteredRewardCardPromotion: z.boolean(),
  enableAdReRanking: z.boolean(),
  groupEdmVariants: z.boolean(),
  categoryVersion: z.string(),
  flags: z.object({
    EnablePersonalizationCategoryRestriction: z.boolean(),
  }),
});

export type WoolworthsCategoryPayload = z.infer<typeof WoolworthsCategoryPayloadSchema>;

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
      products: dto.Bundles
        .flatMap((bundle) => bundle.Products)
        .filter((product) => !!product.barcode),
    };
  });

export type WoolworthsCategoryResponse = z.infer<typeof WoolworthsCategoryResponseSchema>;
