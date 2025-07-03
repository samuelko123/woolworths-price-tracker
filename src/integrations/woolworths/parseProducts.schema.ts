import type z from "zod";

import { WoolworthsProductSchema } from "./fetchCategoryPage.schema";

export const ParsedProductSchema = WoolworthsProductSchema
  .transform((raw) => ({
    barcode: raw.Barcode,
    sku: String(raw.Stockcode),
    name: raw.DisplayName,
    packageSize: raw.PackageSize,
    imageUrl: raw.MediumImageFile,
    price: raw.Price,
  }));

export type ParsedProduct = z.infer<typeof ParsedProductSchema>;
