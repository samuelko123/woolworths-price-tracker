import z from "zod";

export const WoolworthsProductsResponseSchema = z
  .object({
    TotalRecordCount: z.number(),
    Bundles: z.array(
      z.object({
        Products: z.array(z.unknown()),
      }),
    ),
  })
  .transform((dto) => ({
    total: dto.TotalRecordCount,
    items: dto.Bundles.flatMap((bundle) => bundle.Products),
  }));
