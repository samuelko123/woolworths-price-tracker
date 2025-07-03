import { z } from "zod";

const WoolworthsProductSchema = z
  .object({
    Barcode: z.string().nullable(),
    Stockcode: z.number(),
    DisplayName: z.string(),
    PackageSize: z.string(),
    MediumImageFile: z.string(),
    Price: z.number(),
  });

export const WoolworthsCategoryPageResponseSchema = z
  .object({
    TotalRecordCount: z.number(),
    Bundles: z.array(
      z.object({
        Products: z.array(WoolworthsProductSchema),
      }),
    ),
  })
  .transform((dto) => {
    return {
      total: dto.TotalRecordCount,
      items: dto.Bundles.flatMap((bundle) => bundle.Products),
    };
  });

export type WoolworthsCategoryPageResponse = z.infer<typeof WoolworthsCategoryPageResponseSchema>;
