import { z } from "zod";

const ProductSchema = z
  .object({
    Barcode: z.string().nullable(),
    Stockcode: z.number(),
    DisplayName: z.string(),
    PackageSize: z.string(),
    MediumImageFile: z.string(),
    Price: z.number(),
  })
  .transform((obj) => ({
    barcode: obj.Barcode,
    sku: String(obj.Stockcode),
    name: obj.DisplayName,
    packageSize: obj.PackageSize,
    imageUrl: obj.MediumImageFile,
    price: obj.Price,
  }));

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
