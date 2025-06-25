import z from "zod";

export const ProductSchema = z
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

export type Product = {
  barcode: string | null;
  sku: string;
  name: string;
  packageSize: string;
  imageUrl: string;
  price: number;
};
