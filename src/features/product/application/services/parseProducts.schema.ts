import { z } from "zod";

export const WoolworthsProductSchema = z.object({
  Barcode: z.string().nullable(),
  Stockcode: z.number(),
  DisplayName: z.string(),
  PackageSize: z.string(),
  MediumImageFile: z.string(),
  Price: z.number(),
}).transform((raw) => ({
  barcode: raw.Barcode,
  sku: String(raw.Stockcode),
  name: raw.DisplayName,
  packageSize: raw.PackageSize,
  imageUrl: raw.MediumImageFile,
  price: raw.Price,
}));
