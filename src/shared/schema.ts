import { z } from "zod";

const LambdaResponseSchema = z.object({
  statusCode: z.number(),
  body: z.string(),
});

export type LambdaResponse = z.infer<typeof LambdaResponseSchema>;

export const CategoryMessageSchema = z.object({
  id: z.string(),
  level: z.number(),
  urlName: z.string(),
  displayName: z.string(),
});

const CategorySchema = z
  .object({
    NodeId: z.string(),
    NodeLevel: z.number(),
    Description: z.string(),
    UrlFriendlyName: z.string(),
  })
  .transform((obj) => ({
    id: obj.NodeId,
    level: obj.NodeLevel,
    urlName: obj.UrlFriendlyName,
    displayName: obj.Description,
  }));

export type Category = z.infer<typeof CategorySchema>;

export const CategoriesDTOSchema = z
  .object({
    Categories: CategorySchema.array(),
  })
  .transform((obj) => ({
    categories: obj.Categories,
  }));

export type CategoriesDTO = z.infer<typeof CategoriesDTOSchema>;

const ProductSchema = z
  .object({
    Barcode: z.string(),
    Stockcode: z.number(),
    DisplayName: z.string(),
    PackageSize: z.string(),
    MediumImageFile: z.string(),
    Price: z.number(),
  })
  .transform((obj) => ({
    barcode: obj.Barcode,
    sku: obj.Stockcode,
    name: obj.DisplayName,
    packageSize: obj.PackageSize,
    imageUrl: obj.MediumImageFile,
    price: obj.Price,
  }));

export type Product = z.infer<typeof ProductSchema>;

export const CategoryProductsDTOSchema = z
  .object({
    TotalRecordCount: z.number(),
    Bundles: z.array(
      z.object({
        Products: z.array(ProductSchema),
      })
    ),
  })
  .transform((dto) => {
    return {
      total: dto.TotalRecordCount,
      products: dto.Bundles.flatMap((bundle) => bundle.Products),
    };
  });
